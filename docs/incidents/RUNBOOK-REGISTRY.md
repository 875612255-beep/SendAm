# Incident Runbook Registry

> **Closes #227**
>
> Every critical alert must link to a tested runbook with an owner and a
> last-exercised date. This registry is the single source of truth for that
> mapping. Runbooks are exercised via tabletop drills (see
> `docs/incidents/drills/`) and the `last-exercised` column is updated after
> each drill.

## How to use this registry

1. When a critical alert fires, look up the alert name in the table below.
2. Open the linked runbook and follow it top-to-bottom.
3. After resolution, record the incident in a post-incident review under
   `docs/incidents/YYYY-MM-DD-<slug>.md`.
4. After any tabletop drill, update the `last-exercised` date for the affected
   runbook(s) and record follow-up actions in `docs/incidents/drills/`.

## Runbook registry

| Alert / Scenario | Severity | Runbook | Owner | Last exercised |
|------------------|----------|---------|-------|----------------|
| `SendAmApiDown` | P0 | [Payment Outage Response §4a](../OPERATOR-RECOVERY-PLAYBOOK.md#4a-stellar-settlement-failures) | Engineering lead | 2026-08-29 |
| `SendAmWorkerDown` | P0 | [Queue Failure Response §7b](../OPERATOR-RECOVERY-PLAYBOOK.md#7b-worker-process-not-running) | Engineering lead | 2026-08-29 |
| `SendAmWorkerNotReady` | P0 | [Queue Failure Response §7b](../OPERATOR-RECOVERY-PLAYBOOK.md#7b-worker-process-not-running) | Engineering lead | 2026-08-29 |
| `SendAmWorkerHeartbeatStale` | P0 | [Queue Failure Response §7b](../OPERATOR-RECOVERY-PLAYBOOK.md#7b-worker-process-not-running) | Engineering lead | 2026-08-29 |
| `SendAmQueueLagHigh` | P0 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmQueueStalled` | P2 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmDepositSweepStale` | P0 | [Payment Outage Response §4a](../OPERATOR-RECOVERY-PLAYBOOK.md#4a-stellar-settlement-failures) | Payments lead | 2026-08-29 |
| `SendAmHighHttpErrorRate` | P0 | [Payment Outage Response §4b](../OPERATOR-RECOVERY-PLAYBOOK.md#4b-high-failed-payment-rate) | Engineering lead | 2026-08-29 |
| `SendAmHighLatency` | P2 | [Payment Outage Response §4a](../OPERATOR-RECOVERY-PLAYBOOK.md#4a-stellar-settlement-failures) | Engineering lead | 2026-08-29 |
| `SendAmUnhandledExceptions` | P0 | [Exception Spike §9](../OPERATOR-RECOVERY-PLAYBOOK.md#9-rollback-criteria--procedures) | Engineering lead | 2026-08-29 |
| `SendAmQueueFailures` | P0 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmDatabaseHealthDegraded` | P0 | [Database Incident Response §6a](../OPERATOR-RECOVERY-PLAYBOOK.md#6a-database-connection-lost) | Engineering lead | 2026-08-29 |
| `SendAmRedisDisconnected` | P0 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmRedisRetriesExhausted` | P0 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmQueueInlineFallback` | P0 | [Queue Failure Response §7a](../OPERATOR-RECOVERY-PLAYBOOK.md#7a-whatsapp-messages-not-processed) | Engineering lead | 2026-08-29 |
| `SendAmCriticalDependencyDown` | P0 | [KYC / Compliance Incident Response §8](../OPERATOR-RECOVERY-PLAYBOOK.md#8-kyc--compliance-incident-response) | Provider owner | 2026-08-29 |
| `SendAmImportantDependencyDown` | P2 | [KYC / Compliance Incident Response §8](../OPERATOR-RECOVERY-PLAYBOOK.md#8-kyc--compliance-incident-response) | Provider owner | 2026-08-29 |
| `SendAmDependencyHealthMissing` | P2 | [KYC / Compliance Incident Response §8](../OPERATOR-RECOVERY-PLAYBOOK.md#8-kyc--compliance-incident-response) | Provider owner | 2026-08-29 |
| Duplicate payment detected | P0 | [Duplicate Payment Response §4d](../OPERATOR-RECOVERY-PLAYBOOK.md#4d-duplicate-payment-detected) | Payments lead | 2026-08-29 |
| Credential compromise suspected | P0 | [Credential Compromise Response §5d](../OPERATOR-RECOVERY-PLAYBOOK.md#5d-credential-compromise-suspected) | Security lead | 2026-08-29 |
| Key material compromise / rotation | P0 | [Key Management Incident Response §13](../OPERATOR-RECOVERY-PLAYBOOK.md#13-key-management-incident-response) | Security lead | 2026-08-29 |

## Critical alert → runbook coverage matrix

The following critical alerts are covered by a tested runbook:

| Alert | Runbook section | Owner | Last exercised |
|-------|----------------|-------|----------------|
| `SendAmApiDown` | §4a | Engineering lead | 2026-08-29 |
| `SendAmWorkerDown` | §7b | Engineering lead | 2026-08-29 |
| `SendAmWorkerNotReady` | §7b | Engineering lead | 2026-08-29 |
| `SendAmWorkerHeartbeatStale` | §7b | Engineering lead | 2026-08-29 |
| `SendAmQueueLagHigh` | §7a | Engineering lead | 2026-08-29 |
| `SendAmDepositSweepStale` | §4a | Payments lead | 2026-08-29 |
| `SendAmHighHttpErrorRate` | §4b | Engineering lead | 2026-08-29 |
| `SendAmUnhandledExceptions` | §9 | Engineering lead | 2026-08-29 |
| `SendAmQueueFailures` | §7a | Engineering lead | 2026-08-29 |
| `SendAmDatabaseHealthDegraded` | §6a | Engineering lead | 2026-08-29 |
| `SendAmRedisDisconnected` | §7a | Engineering lead | 2026-08-29 |
| `SendAmRedisRetriesExhausted` | §7a | Engineering lead | 2026-08-29 |
| `SendAmQueueInlineFallback` | §7a | Engineering lead | 2026-08-29 |
| `SendAmCriticalDependencyDown` | §8 | Provider owner | 2026-08-29 |

## Supporting runbooks and operational docs

Deployment, recovery and operations documents that an on-call engineer may need
while working a registry entry. The alert table above stays the source of truth
for alert-to-runbook mapping; these are the deeper references behind it.

| Document | What it covers | Related registry entries |
|----------|----------------|--------------------------|
| [Operator Recovery Playbook](../OPERATOR-RECOVERY-PLAYBOOK.md) | Severity levels, escalation, and the incident response procedures every alert above links into | All alerts |
| [Background worker deployment](../BACKGROUND-WORKERS.md) | How the queue workers are configured, deployed, and identified per replica | `SendAmWorkerDown`, `SendAmWorkerNotReady`, `SendAmWorkerHeartbeatStale`, queue alerts |
| [Production observability](../OBSERVABILITY.md) | Telemetry contract, monitoring ownership, operator recovery and rollback | All `SendAm*` alerts |
| [Production PostgreSQL runbook](../PRODUCTION-DATABASE.md) | Database configuration, rollout, monitoring, rollback and recovery, and restore-verification drills | `SendAmDatabaseHealthDegraded` |
| [Production WhatsApp webhook](../PRODUCTION-WHATSAPP-WEBHOOK.md) | Webhook credentials, ownership and rollout | `SendAmQueueLagHigh`, `SendAmQueueFailures` |
| [Wallet provisioning recovery](../wallet-provisioning.md) | Recovering failed wallet creation, funding and trustline stages | Wallet incidents (Playbook §3) |
| [Smile ID KYC lifecycle](../KYC-PROVIDER.md) | KYC sandbox setup, rollout, idempotency, monitoring, recovery and rollback | Provider alerts, Playbook §8 |
| [Secret scanning and push protection](../SECRET-SCANNING.md) | What is scanned, false-positive review, and credential rotation response | Credential compromise suspected |
| [Admin account migration and rollback](../admin-account-migration.md) | Rollout and rollback of the admin account migration | Rollback criteria (Playbook §9) |
| [Customer identity migration and rollback plan](../IDENTITY_MIGRATION_PLAN.md) | Pre-migration validation, cutover and rollback for customer identities | Rollback criteria (Playbook §9) |
| [Deployment manifests](../../apps/api/DEPLOYMENT.md) | Signed deployment manifest required for every production release | Rollback criteria (Playbook §9) |
| [Load testing and capacity limits](../LOAD-TESTING.md) | How to run load tests, budgets, capacity settings, and scaling signals | `SendAmHighLatency`, `SendAmQueueLagHigh` |

## Drill records

| Drill record | Runbooks exercised |
|--------------|--------------------|
| [2026-08-29 Tabletop: Payment outage and duplicate payment](drills/2026-08-29-tabletop-payment.md) | Payment Outage Response §4a-§4b, Duplicate Payment Response §4d |
| [2026-08-29 Tabletop: Key management and credential compromise](drills/2026-08-29-tabletop-key-management.md) | Credential Compromise Response §5d, Key Management Incident Response §13 |

## Drill schedule

| Drill | Frequency | Owner | Last run | Next due |
|-------|-----------|-------|----------|----------|
| Payment outage tabletop | Quarterly | Payments lead | 2026-08-29 | 2026-11-29 |
| Key-management tabletop | Quarterly | Security lead | 2026-08-29 | 2026-11-29 |
| Database restore drill | Monthly (automated) | Engineering lead | 2026-08-29 | 2026-09-29 |
| Queue failure tabletop | Semi-annual | Engineering lead | 2026-08-29 | 2027-02-29 |
| Provider outage tabletop | Semi-annual | Provider owner | 2026-08-29 | 2027-02-29 |
| Credential compromise tabletop | Semi-annual | Security lead | 2026-08-29 | 2027-02-29 |

---

*Last updated: 2026-08-29. Policy version: runbook-registry-v1.*
