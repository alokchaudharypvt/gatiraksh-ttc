"""
Comprehensive test runner for Railway Traffic Control System
Includes unit tests, integration tests, and E2E scenarios
"""

import json
import time
import requests
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class TestResult:
    test_id: str
    name: str
    status: str  # "pass", "fail", "skip"
    duration: float
    error_message: str = ""
    details: Dict[str, Any] = None

class RailwayTestRunner:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.results: List[TestResult] = []
        
    def run_all_tests(self) -> Dict[str, Any]:
        """Run complete test suite"""
        print("🚂 Starting Railway Traffic Control System Test Suite")
        print("=" * 60)
        
        # Unit Tests
        self.run_unit_tests()
        
        # Integration Tests  
        self.run_integration_tests()
        
        # E2E Tests
        self.run_e2e_tests()
        
        # Performance Tests
        self.run_performance_tests()
        
        return self.generate_report()
    
    def run_unit_tests(self):
        """Unit tests for individual components"""
        print("\n📋 Running Unit Tests...")
        
        # Test conflict detection logic
        self.test_conflict_detection()
        
        # Test AI suggestion generation
        self.test_ai_suggestions()
        
        # Test train position calculations
        self.test_train_positions()
        
        # Test scenario validation
        self.test_scenario_validation()
    
    def run_integration_tests(self):
        """Integration tests for API endpoints"""
        print("\n🔗 Running Integration Tests...")
        
        # Test API endpoints
        self.test_trains_api()
        self.test_conflicts_api()
        self.test_scenarios_api()
        self.test_demo_api()
    
    def run_e2e_tests(self):
        """End-to-end test scenarios"""
        print("\n🎯 Running E2E Test Scenarios...")
        
        # E2E_001: Complete optimization flow
        self.test_e2e_optimization_flow()
        
        # E2E_002: Conflict resolution flow
        self.test_e2e_conflict_resolution()
        
        # E2E_003: Demo simulation flow
        self.test_e2e_demo_simulation()
    
    def run_performance_tests(self):
        """Performance and load tests"""
        print("\n⚡ Running Performance Tests...")
        
        self.test_api_response_times()
        self.test_concurrent_requests()
        self.test_large_dataset_handling()
    
    def test_conflict_detection(self):
        """Test conflict detection algorithms"""
        start_time = time.time()
        
        try:
            # Test platform conflict detection
            trains = [
                {"id": "12951", "platform": "1", "arrival": "14:30", "departure": "14:35"},
                {"id": "12002", "platform": "1", "arrival": "14:32", "departure": "14:40"}
            ]
            
            # Simulate conflict detection logic
            conflicts = self.detect_platform_conflicts(trains)
            
            assert len(conflicts) == 1, f"Expected 1 conflict, got {len(conflicts)}"
            assert conflicts[0]["type"] == "platform_conflict"
            
            self.results.append(TestResult(
                test_id="UNIT_001",
                name="Platform Conflict Detection",
                status="pass",
                duration=time.time() - start_time
            ))
            
        except Exception as e:
            self.results.append(TestResult(
                test_id="UNIT_001", 
                name="Platform Conflict Detection",
                status="fail",
                duration=time.time() - start_time,
                error_message=str(e)
            ))
    
    def test_ai_suggestions(self):
        """Test AI suggestion generation"""
        start_time = time.time()
        
        try:
            response = requests.post(f"{self.base_url}/api/conflicts", json={
                "action": "generate_suggestions",
                "conflictId": "TEST_CNF001"
            }, timeout=10)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert "suggestions" in data
            assert len(data["suggestions"]) >= 1
            
            # Validate suggestion structure
            suggestion = data["suggestions"][0]
            required_fields = ["id", "title", "description", "effectiveness", "impact"]
            for field in required_fields:
                assert field in suggestion, f"Missing field: {field}"
            
            self.results.append(TestResult(
                test_id="UNIT_004",
                name="AI Suggestion Generation", 
                status="pass",
                duration=time.time() - start_time
            ))
            
        except Exception as e:
            self.results.append(TestResult(
                test_id="UNIT_004",
                name="AI Suggestion Generation",
                status="fail", 
                duration=time.time() - start_time,
                error_message=str(e)
            ))
    
    def test_e2e_optimization_flow(self):
        """E2E test: Complete AI optimization workflow"""
        start_time = time.time()
        
        try:
            # Step 1: Get current performance data
            perf_response = requests.get(f"{self.base_url}/api/performance")
            assert perf_response.status_code == 200
            
            # Step 2: Run AI optimization
            opt_response = requests.post(f"{self.base_url}/api/ai/optimize", json={
                "algorithm": "hybrid",
                "target": "throughput", 
                "timeHorizon": "1h"
            })
            assert opt_response.status_code == 200
            opt_data = opt_response.json()
            assert opt_data["success"] == True
            assert "result" in opt_data
            
            # Step 3: Verify improvement metrics
            result = opt_data["result"]
            assert "improvement" in result
            assert result["improvement"] > 0
            
            self.results.append(TestResult(
                test_id="E2E_001",
                name="Complete Optimization Flow",
                status="pass",
                duration=time.time() - start_time,
                details={"improvement": result["improvement"]}
            ))
            
        except Exception as e:
            self.results.append(TestResult(
                test_id="E2E_001",
                name="Complete Optimization Flow", 
                status="fail",
                duration=time.time() - start_time,
                error_message=str(e)
            ))
    
    def test_e2e_conflict_resolution(self):
        """E2E test: Conflict detection and resolution"""
        start_time = time.time()
        
        try:
            # Step 1: Get active conflicts
            conflicts_response = requests.get(f"{self.base_url}/api/conflicts")
            assert conflicts_response.status_code == 200
            conflicts_data = conflicts_response.json()
            
            if len(conflicts_data["data"]) > 0:
                conflict = conflicts_data["data"][0]
                
                # Step 2: Generate AI suggestions
                suggestions_response = requests.post(f"{self.base_url}/api/conflicts", json={
                    "action": "generate_suggestions",
                    "conflictId": conflict["id"]
                })
                assert suggestions_response.status_code == 200
                
                # Step 3: Apply resolution
                resolve_response = requests.post(f"{self.base_url}/api/conflicts", json={
                    "action": "resolve",
                    "conflictId": conflict["id"],
                    "suggestionId": "SUG001"
                })
                assert resolve_response.status_code == 200
                
                self.results.append(TestResult(
                    test_id="E2E_005",
                    name="Conflict Resolution Flow",
                    status="pass",
                    duration=time.time() - start_time
                ))
            else:
                self.results.append(TestResult(
                    test_id="E2E_005",
                    name="Conflict Resolution Flow",
                    status="skip",
                    duration=time.time() - start_time,
                    error_message="No active conflicts to test"
                ))
                
        except Exception as e:
            self.results.append(TestResult(
                test_id="E2E_005",
                name="Conflict Resolution Flow",
                status="fail",
                duration=time.time() - start_time,
                error_message=str(e)
            ))
    
    def test_e2e_demo_simulation(self):
        """E2E test: Demo simulation workflow"""
        start_time = time.time()
        
        try:
            # Step 1: Load demo data
            demo_response = requests.post(f"{self.base_url}/api/demo/seed", json={
                "mode": "conflict_demo"
            })
            assert demo_response.status_code == 200
            
            # Step 2: Start simulation
            sim_response = requests.post(f"{self.base_url}/api/demo/simulate", json={
                "scenario": "conflict_demo",
                "timeScale": 4,
                "duration": 30
            })
            assert sim_response.status_code == 200
            sim_data = sim_response.json()
            
            # Step 3: Verify simulation results
            assert sim_data["success"] == True
            assert "simulation" in sim_data
            assert len(sim_data["simulation"]["events"]) > 0
            
            self.results.append(TestResult(
                test_id="E2E_012",
                name="Demo Simulation Flow",
                status="pass", 
                duration=time.time() - start_time,
                details={"events": len(sim_data["simulation"]["events"])}
            ))
            
        except Exception as e:
            self.results.append(TestResult(
                test_id="E2E_012",
                name="Demo Simulation Flow",
                status="fail",
                duration=time.time() - start_time,
                error_message=str(e)
            ))
    
    def test_api_response_times(self):
        """Test API response time performance"""
        endpoints = [
            "/api/trains",
            "/api/conflicts", 
            "/api/performance",
            "/api/scenarios"
        ]
        
        for endpoint in endpoints:
            start_time = time.time()
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                duration = time.time() - start_time
                
                # Response time should be under 2 seconds
                assert duration < 2.0, f"Response time {duration:.2f}s exceeds 2s limit"
                assert response.status_code == 200
                
                self.results.append(TestResult(
                    test_id=f"PERF_{endpoint.replace('/', '_')}",
                    name=f"Response Time {endpoint}",
                    status="pass",
                    duration=duration
                ))
                
            except Exception as e:
                self.results.append(TestResult(
                    test_id=f"PERF_{endpoint.replace('/', '_')}",
                    name=f"Response Time {endpoint}",
                    status="fail",
                    duration=time.time() - start_time,
                    error_message=str(e)
                ))
    
    def detect_platform_conflicts(self, trains: List[Dict]) -> List[Dict]:
        """Helper method to detect platform conflicts"""
        conflicts = []
        
        for i, train1 in enumerate(trains):
            for train2 in trains[i+1:]:
                if train1["platform"] == train2["platform"]:
                    # Check time overlap
                    if self.times_overlap(train1["arrival"], train1["departure"], 
                                        train2["arrival"], train2["departure"]):
                        conflicts.append({
                            "type": "platform_conflict",
                            "trains": [train1["id"], train2["id"]],
                            "platform": train1["platform"]
                        })
        
        return conflicts
    
    def times_overlap(self, start1: str, end1: str, start2: str, end2: str) -> bool:
        """Check if two time ranges overlap"""
        # Simplified time comparison (assumes same day)
        return not (end1 <= start2 or end2 <= start1)
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r.status == "pass"])
        failed_tests = len([r for r in self.results if r.status == "fail"])
        skipped_tests = len([r for r in self.results if r.status == "skip"])
        
        total_duration = sum(r.duration for r in self.results)
        
        report = {
            "summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "skipped": skipped_tests,
                "success_rate": (passed_tests / total_tests * 100) if total_tests > 0 else 0,
                "total_duration": total_duration
            },
            "results": [
                {
                    "test_id": r.test_id,
                    "name": r.name,
                    "status": r.status,
                    "duration": r.duration,
                    "error_message": r.error_message,
                    "details": r.details
                }
                for r in self.results
            ],
            "categories": {
                "unit_tests": [r for r in self.results if r.test_id.startswith("UNIT_")],
                "integration_tests": [r for r in self.results if r.test_id.startswith("INT_")],
                "e2e_tests": [r for r in self.results if r.test_id.startswith("E2E_")],
                "performance_tests": [r for r in self.results if r.test_id.startswith("PERF_")]
            }
        }
        
        # Print summary
        print("\n" + "=" * 60)
        print("🎯 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⏭️  Skipped: {skipped_tests}")
        print(f"📊 Success Rate: {report['summary']['success_rate']:.1f}%")
        print(f"⏱️  Total Duration: {total_duration:.2f}s")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result.status == "fail":
                    print(f"  - {result.test_id}: {result.name}")
                    print(f"    Error: {result.error_message}")
        
        return report

if __name__ == "__main__":
    runner = RailwayTestRunner()
    report = runner.run_all_tests()
    
    # Save report to file
    with open("test_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Full report saved to test_report.json")
    
    # Exit with appropriate code
    exit(0 if report["summary"]["failed"] == 0 else 1)
