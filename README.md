# Testing Prometheus' handling of quotes and special chars

The purpose of this project is to inform https://github.com/grafana/grafana/issues/96063 by establishing how Prometheus handles quotes and special characters in label values.

## Prerequisites

- Docker
- pnpm

## Getting started

Spin up the Prometheus instance:

```
docker compose up -d --build
```

Run the tests:

```
pnpm test
```
