import { serve } from "@hono/node-server";
import { Hono } from "hono/quick";

const app = new Hono();
const port = 8000;

// metrics collected by Prometheus
const METRICS = `
# TYPE test_single_quote gauge
# HELP test_single_quote Metric with single quote in label
test_single_quote{label="looking'glass"} 1
test_single_quote{label="o'reilly"} 2
test_single_quote{label="isn't it"} 3

# TYPE test_double_quote gauge
# HELP test_double_quote Metric with double quote in label
test_double_quote{label="looking\\"glass"} 4
test_double_quote{label="\\"quoted\\"value"} 5
test_double_quote{label="start\\"end"} 6

# TYPE test_backslash gauge
# HELP test_backslash Metric with backslash in label
test_backslash{label="back\\\\slash"} 7
test_backslash{label="double\\\\\\\\slash"} 8
test_backslash{label="mixed\\\\quote'"} 9

# TYPE test_mixed_special gauge
# HELP test_mixed_special Metric with mixed special characters in label
test_mixed_special{label="'quoted\\"mixed\\\\special'"} 10
test_mixed_special{label="special\\\\chars\\"and'more"} 11
test_mixed_special{label="regex.*+pattern"} 12

# TYPE test_regex_chars gauge
# HELP test_regex_chars Metric with regex special characters in label
test_regex_chars{label=".*+"} 13
test_regex_chars{label="[a-z]+"} 14
test_regex_chars{label="(test|prod)"} 15
`;

app.get("/metrics", (c) => {
  return c.text(METRICS, 200, {
    "Content-Type": "text/plain",
  });
});

console.log(`Test exporter starting on port ${port}...`);
serve({
  fetch: app.fetch,
  port,
});
