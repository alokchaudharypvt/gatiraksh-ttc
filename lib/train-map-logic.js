// Import Leaflet library
const L = window.L

// ================== Map ==================
const map = L.map("map").setView([22.9734, 78.6569], 5)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map)

const markers = L.markerClusterGroup()

// ================== Icons ==================
const trainIcon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const stationIcon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const delayedIcon = L.icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-yellow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
})

// ================== Data stores ==================
const stationsUrl = "https://raw.githubusercontent.com/kavyakhapra/train-station/main/stations.json"
const stationDict = {}
const trainMarkers = {}
const lastApiKpisTime = 0
const apiKpisValidityMs = 15_000

// ================== Priority Rules ==================
const PRIORITY_RULES = {
  EXPRESS: 1,
  MAIL_EXPRESS: 2,
  LOCAL: 3,
  FREIGHT: 4,
}

// ================== Populate train select ==================
function populateTrainSelect() {
  const select = document.getElementById("trainSelect")
  if (!select) return

  select.innerHTML = ""
  const placeholder = document.createElement("option")
  placeholder.value = ""
  placeholder.textContent = "Select Train"
  select.appendChild(placeholder)

  const ids = Object.keys(trainMarkers).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  ids.forEach((id) => {
    const t = trainMarkers[id]
    const opt = document.createElement("option")
    opt.value = id
    opt.textContent = `${id}${t.name ? " — " + t.name : ""}`
    select.appendChild(opt)
  })
}

// ================== Load Stations ==================
fetch(stationsUrl)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((station) => {
      if (station.lat && station.lon) {
        stationDict[station.code] = [station.lat, station.lon]
        const marker = L.marker([station.lat, station.lon], {
          icon: stationIcon,
        }).bindPopup(`<b>🚉 ${station.name}</b><br>Code: ${station.code}`)
        markers.addLayer(marker)
      }
    })
    map.addLayer(markers)
  })
  .catch((err) => console.error("Failed to load stations.json:", err))

// ================== Delay slider UI ==================
const delayRange = document.getElementById("delayRange")
const delayValue = document.getElementById("delayValue")
if (delayRange && delayValue) {
  delayRange.addEventListener("input", () => {
    delayValue.textContent = `Delay: ${delayRange.value} mins`
  })
}

// ================== Apply Simulation ==================
function applySimulation() {
  const select = document.getElementById("trainSelect")
  if (!select) return
  const selected = select.value
  if (!selected) {
    alert("Please select a train to apply simulation.")
    return
  }

  const train = trainMarkers[selected]
  if (!train) return

  const delayMins = Number.parseInt(delayRange.value || "0", 10) || 0
  train.delay = delayMins

  if (delayMins > 0) {
    train.holdUntil = Date.now() + delayMins * 60_000
    train.marker.setIcon(delayedIcon)
    train.marker.bindPopup(
      `<b>🚆 ${train.name || selected} (${selected})</b><br>
       Delay: <b>${delayMins} mins</b><br>
       Holding until: ${new Date(train.holdUntil).toLocaleTimeString()}`,
    )
  } else {
    train.holdUntil = null
    train.delay = 0
    train.marker.setIcon(trainIcon)
  }

  updateKPIs()
}

// ================== Priority Override ==================
function applyPriority() {
  const select = document.getElementById("trainSelect")
  const prioritySelect = document.getElementById("prioritySelect")
  const selected = select.value
  if (!selected) {
    alert("Please select a train to set priority.")
    return
  }
  const priority = Number.parseInt(prioritySelect.value, 10)
  setTrainPriority(selected, priority)
}

function setTrainPriority(trainId, priority) {
  if (trainMarkers[trainId]) {
    trainMarkers[trainId].priority = priority
    alert(`Priority of Train ${trainId} updated to ${priority}`)
  }
}

// ================== Load Random Trains ==================
async function loadRandomTrains(count = 5) {
  try {
    const trainsUrl = "https://raw.githubusercontent.com/datameet/railways/master/trains.json"
    const resp = await fetch(trainsUrl)
    const trains = await resp.json()

    const shuffled = trains.features.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    selected.forEach((feature) => {
      const coords = feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])
      if (coords.length < 2) return

      const routeLine = L.polyline(coords, { color: "blue", weight: 2 }).addTo(map)

      const marker = L.marker(coords[0], { icon: trainIcon })
        .addTo(map)
        .bindPopup(`<b>🚆 ${feature.properties.name} (${feature.properties.number})</b><br>Type: Demo`)

      trainMarkers[feature.properties.number] = {
        marker,
        route: coords,
        progress: 0,
        segment: 0,
        line: routeLine,
        name: feature.properties.name || feature.properties.number,
        number: feature.properties.number,
        delay: 0,
        holdUntil: null,
        priority: PRIORITY_RULES.MAIL_EXPRESS, // default
      }
    })

    populateTrainSelect()
  } catch (err) {
    console.error("Failed to load trains.json:", err)
  }
}

// ================== Conflict Detection with Prioritization ==================
let activeConflictLines = {}

function detectConflicts() {
  const ids = Object.keys(trainMarkers)
  const conflicts = []

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const id1 = ids[i]
      const id2 = ids[j]
      const t1 = trainMarkers[id1]
      const t2 = trainMarkers[id2]
      if (!t1 || !t2) continue

      const pos1 = t1.marker.getLatLng()
      const pos2 = t2.marker.getLatLng()

      const distance = map.distance(pos1, pos2)
      if (distance < 500) {
        conflicts.push({ trains: [id1, id2], distance, pos1, pos2 })
      }
    }
  }

  Object.values(activeConflictLines).forEach((line) => map.removeLayer(line))
  activeConflictLines = {}

  if (conflicts.length > 0) {
    const recBox = document.getElementById("recommendationText")
    recBox.innerHTML = ""

    conflicts.forEach((c) => {
      const [id1, id2] = c.trains
      const t1 = trainMarkers[id1]
      const t2 = trainMarkers[id2]
      if (!t1 || !t2) return

      let lower, higher
      if (t1.priority < t2.priority) {
        higher = t1
        lower = t2
      } else {
        higher = t2
        lower = t1
      }

      if (!lower.holdUntil) {
        lower.holdUntil = Date.now() + 2 * 60_000
        lower.delay = 2
        lower.marker.setIcon(delayedIcon)
      }

      recBox.innerHTML += `⚠️ Conflict: Train ${id1} and Train ${id2} within ${Math.round(
        c.distance,
      )}m. Automatically holding Train ${lower.number} for 2 mins.<br>`

      const line = L.polyline([c.pos1, c.pos2], {
        color: "red",
        weight: 3,
        dashArray: "6, 6",
      }).addTo(map)

      activeConflictLines[`${id1}-${id2}`] = line
    })
  } else {
    Object.values(trainMarkers).forEach((t) => {
      if (!t.delay || t.delay === 0) {
        t.marker.setIcon(trainIcon)
      }
    })
    document.getElementById("recommendationText").textContent = "✅ No conflicts detected. Network running smoothly."
  }
}
setInterval(detectConflicts, 2000)

// ================== Train Movement ==================
function moveTrains() {
  const now = Date.now()
  Object.values(trainMarkers).forEach((train) => {
    const route = train.route
    if (!route || route.length < 2) return

    if (train.holdUntil && now < train.holdUntil) return

    if (train.holdUntil && now >= train.holdUntil) {
      train.holdUntil = null
      train.delay = 0
      train.marker.setIcon(trainIcon)
    }

    if (train.segment >= route.length - 1) {
      train.segment = 0
      train.progress = 0
    }

    const start = route[train.segment]
    const end = route[train.segment + 1]
    if (!start || !end) return

    if (train.progress < 1) {
      train.progress += 0.003
      const lat = start[0] + (end[0] - start[0]) * train.progress
      const lon = start[1] + (end[1] - start[1]) * train.progress
      train.marker.setLatLng([lat, lon])
    } else {
      train.progress = 0
      train.segment++
    }
  })
}
setInterval(moveTrains, 100)

// ================== KPIs ==================
function updateKPIs() {
  if (Date.now() - lastApiKpisTime < apiKpisValidityMs) return

  const ids = Object.keys(trainMarkers)
  const total = ids.length
  if (total === 0) return

  let sumDelay = 0
  let delayedCount = 0
  ids.forEach((id) => {
    const d = trainMarkers[id].delay || 0
    sumDelay += d
    if (d > 0) delayedCount++
  })

  const avgDelay = (sumDelay / total).toFixed(1)
  const punctuality = (((total - delayedCount) / total) * 100).toFixed(1)
  const throughput = Math.round(total * 6)

  document.getElementById("kpiDelay").textContent = `${avgDelay} mins (est.)`
  document.getElementById("kpiPunctuality").textContent = `${punctuality} % (est.)`
  document.getElementById("kpiThroughput").textContent = `${throughput} trains/hr (est.)`
}
setInterval(updateKPIs, 5000)

// ================== Auto-load ==================
loadRandomTrains(30)
