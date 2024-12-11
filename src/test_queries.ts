const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function testPromQuery(query: string): Promise<boolean> {
  try {
    const url = new URL("http://localhost:9094/api/v1/query");
    url.searchParams.set("query", query);

    const response = await fetch(url);
    const data = await response.json();

    console.log("\nQuery:", query);
    console.log("Status:", response.status);
    console.log("Result:", JSON.stringify(data, null, 2));

    if (data.status === "error") {
      return false;
    }

    return data.data?.result?.length > 0;
  } catch (error) {
    console.log("\nQuery:", query);
    console.error("Error:", error);
    return false;
  }
}

async function waitForPrometheus(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch("http://localhost:9094/-/ready");
      if (response.ok) {
        console.log("Prometheus is ready");
        return;
      }
    } catch (error) {
      console.log("Waiting for Prometheus to be ready...");
      await sleep(2000);
    }
  }
  throw new Error("Prometheus failed to become ready");
}

async function runTests() {
  console.log("Waiting for services to be ready...");
  await waitForPrometheus();
  await sleep(5000); // Wait for first scrape

  console.log("\nTesting different escaping patterns...\n");

  // single quotes
  console.log("\n=== Single Quote Tests ===");
  await testPromQuery('test_single_quote{label="looking\'glass"}'); // Should work
  await testPromQuery('test_single_quote{label="looking\\\'glass"}'); // Should fail

  // double quotes
  console.log("\n=== Double Quote Tests ===");
  await testPromQuery('test_double_quote{label="looking\\"glass"}'); // Should work
  await testPromQuery('test_double_quote{label="looking"glass"}'); // Should fail

  // backslashes
  console.log("\n=== Backslash Tests ===");
  await testPromQuery('test_backslash{label="back\\\\slash"}'); // Should work
  await testPromQuery('test_backslash{label="back\\slash"}'); // Should fail

  // mixed special characters
  console.log("\n=== Mixed Special Characters Tests ===");
  await testPromQuery(
    'test_mixed_special{label="\'quoted\\"mixed\\\\special\'"}'
  );

  // egex matches
  console.log("\n=== Regex Pattern Tests ===");
  await testPromQuery('test_regex_chars{label=~"\\\\.*\\\\+"}');
  await testPromQuery('test_regex_chars{label=~"\\\\[a-z\\\\]\\\\+"}');

  // exact vs regex matches
  console.log("\n=== Exact vs Regex Match Tests ===");
  await testPromQuery('test_regex_chars{label=".*+"}'); // Exact match
  await testPromQuery('test_regex_chars{label=~".*+"}'); // Regex match (should match multiple)
}

runTests().catch(console.error);
