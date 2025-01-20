# corprime-test


TODO
- create a monorepo 
- create UI
- create backend 
- local deployment

Deployment:
- UI: DO cdn 
- backend: DO VPS
- terraform?


Limitations:
- no https/no security
- Desktop only
- not a monorepo (no code sharing between UI and backend - the interface code is duplicated)
- no e2e tests for the frontend
- no ci/cd
- no IaC
- 

Legend/assumptions:
This is a UI for displaying exchange prices for BTC in USD. 
The ingestion gateway assumes the ingester sends trades in non-decreasing order timestamp-wise (older trades than the most recent trade are ignored).

