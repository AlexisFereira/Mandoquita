# Product Detail Backend Performance Baseline

Status: Approved

Owner: Backend Architect

Date: 2026-07-12

## Environment

- PostgreSQL 16 in the project Docker Compose environment.
- Application and database running locally.
- Detail resolution exercised through `getProductDetail` with persisted
  lifecycle and category records.

## Method

The reproducible `npm run test:integration:postgres` validation creates an
isolated category, lifecycle fixtures, and 10,000 temporary Products. After a
warm-up it executes 1,000 detail queries at concurrency 20, sorts individual
request durations, evaluates the 95th percentile, verifies deterministic
serialized results, and removes all temporary records.

## Result

- Approved p95 threshold: 50 ms.
- Measured detail-query p95: 12.94 ms.
- Concurrent queries: 20.
- Total measured queries: 1,000.
- Dataset: 10,000 temporary Products plus lifecycle fixtures.
- Query errors: 0.
- Repeated serialized business results: identical.
- PostgreSQL lifecycle constraints: passed.
- Temporary validation data cleanup: passed.

## Optimization Evidence

The initial implementation returned an unbounded related collection and
measured p95 2093.08 ms. Adding an index alone did not resolve the issue because
the query still loaded every related Product through a redundant Category
join. The final implementation limits related results to four, reuses the
already validated Category, and uses an index matching Category, publication,
commercial availability, update time, and stable ID ordering.

## Approval

The Project Architect approved the 50 ms p95 threshold, concurrency 20,
10,000-Product dataset, zero-error requirement, deterministic responses, and
temporary-data cleanup on 2026-07-12. The measured result satisfies the
approved profile.
