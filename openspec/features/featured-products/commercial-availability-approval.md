# Featured Product Commercial Availability Approval

Status: Approved

Decision Owner: Product Requirements Architect

Approver: Project Architect

## Decision Requested

Approve the following behavior for a Product that is Active, Published,
Featured, and not Commercially Available:

1. The Product remains eligible for Featured discovery because Featured
   designation does not imply commercial availability.
2. The persisted historical price and currency remain stored internally.
3. Public contracts return `price: null` and `currency: null`.
4. Presentation must communicate lack of a current commercial offer without
   displaying the historical price as vigente.
5. The Product remains navigable to its published detail.

## Product Decision

The requested behavior is approved.

Editorial state, publication state, Featured designation, and Commercial Availability are independent business dimensions. Therefore, a Product that is Active, Published, and Featured remains eligible for Featured discovery when it is not Commercially Available.

Commercial Availability governs whether a current commercial offer may be communicated. When it is false:

- public price and currency are absent;
- historical commercial values remain internal and shall not be represented as current;
- Featured ordering remains governed exclusively by the approved curation rules;
- the Product remains discoverable and navigable to its published detail;
- the visitor must receive an explicit unavailable-current-offer outcome instead of a blank, malformed, zero, historical, or inferred price;
- contact may remain available for information or assistance, but shall not imply purchase completion or current commercial availability.

## Rationale

This preserves the approved independence between editorial curation and
commercial availability while preventing an expired or unavailable offer from
being represented as current.

## Existing Formal Approvals

- Featured eligibility and designation: approved in `proposal.md`.
- Ranked and deterministic ordering: approved in `proposal.md`.
- Homepage limits of 8 Desktop and 4 Tablet/Mobile: active Homepage Visual
  Refresh requirements.
- Independence from commercial availability: BR-FPC-005.

## Approval Record

- Product Requirements Architect: Approved.
- Project Architect: Approved under the delegated project authority for this decision.
- Approval date: 2026-07-12.

## Acceptance Criteria

```gherkin
Scenario: Featured Product without a current commercial offer remains discoverable
  Given a Product is Active, Published, and Featured
  And the Product is not Commercially Available
  When Featured Products are requested for visitor discovery
  Then the Product remains eligible for Featured discovery
  And its approved Featured ordering is preserved
```

```gherkin
Scenario: Historical price is not exposed as current
  Given a Published Product is not Commercially Available
  And historical price and currency values are retained internally
  When the Product is exposed through a public contract
  Then public price is absent
  And public currency is absent
  And no historical commercial value is represented as current
```

```gherkin
Scenario: Visitor receives a deterministic commercial-availability outcome
  Given a Featured Product is not Commercially Available
  When the Visitor encounters that Product
  Then the Visitor can understand that no current commercial offer is available
  And the Visitor is not shown a blank, malformed, zero, historical, or inferred price
  And the Product remains available for detail exploration
```
