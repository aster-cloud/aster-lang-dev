# GraphQL Queries

All queries are read-only operations sent as `POST /graphql`. Queries require at minimum a valid bearer token and `X-Tenant-Id` header. See [Overview](./overview) for request format details.

---

## Policy Queries

### getPolicy

Retrieve a single policy by its unique identifier.

```graphql
query GetPolicy($id: ID!) {
  getPolicy(id: $id) {
    id
    policyModule
    policyFunction
    version
    status
    createdAt
    updatedAt
    source
  }
}
```

**Variables**

```json
{
  "id": "pol-abc123"
}
```

::: code-group

```bash [curl]
curl -X POST https://policy.aster-lang.dev/graphql \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: acme-corp" \
  -d '{
    "query": "query GetPolicy($id: ID!) { getPolicy(id: $id) { id policyModule policyFunction version status createdAt updatedAt } }",
    "variables": { "id": "pol-abc123" }
  }'
```

```js [JavaScript]
const response = await fetch('https://policy.aster-lang.dev/graphql', {
  method: 'POST',
  headers: {
    Authorization:  'Bearer <token>',
    'Content-Type': 'application/json',
    'X-Tenant-Id':  'acme-corp',
  },
  body: JSON.stringify({
    query: `
      query GetPolicy($id: ID!) {
        getPolicy(id: $id) {
          id
          policyModule
          policyFunction
          version
          status
          createdAt
          updatedAt
        }
      }
    `,
    variables: { id: 'pol-abc123' },
  }),
});

const { data, errors } = await response.json();
```

:::

---

### listPolicies

Retrieve all policies visible to the tenant.

```graphql
query ListPolicies {
  listPolicies {
    id
    policyModule
    policyFunction
    version
    status
    updatedAt
  }
}
```

::: code-group

```bash [curl]
curl -X POST https://policy.aster-lang.dev/graphql \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: acme-corp" \
  -d '{ "query": "query { listPolicies { id policyModule policyFunction version status updatedAt } }" }'
```

```js [JavaScript]
const response = await fetch('https://policy.aster-lang.dev/graphql', {
  method: 'POST',
  headers: {
    Authorization:  'Bearer <token>',
    'Content-Type': 'application/json',
    'X-Tenant-Id':  'acme-corp',
  },
  body: JSON.stringify({
    query: `
      query {
        listPolicies {
          id
          policyModule
          policyFunction
          version
          status
          updatedAt
        }
      }
    `,
  }),
});

const { data } = await response.json();
// data.listPolicies → Policy[]
```

:::

---

## Industry-Specific Queries

These queries invoke domain-specific policy evaluation logic and return structured decision results. Each query passes its arguments through the policy engine and returns an industry-appropriate response type.

### generateLifeQuote

Generate a life insurance quote based on applicant parameters.

```graphql
query GenerateLifeQuote($input: LifeQuoteInput!) {
  generateLifeQuote(input: $input) {
    premium
    coverageAmount
    term
    eligibility
    exclusions
  }
}
```

---

### calculateLifeRiskScore

Calculate a risk score for a life insurance applicant.

```graphql
query CalculateLifeRiskScore($input: LifeRiskInput!) {
  calculateLifeRiskScore(input: $input) {
    score
    band
    factors
  }
}
```

---

### generateAutoQuote

Generate an automobile insurance quote.

```graphql
query GenerateAutoQuote($input: AutoQuoteInput!) {
  generateAutoQuote(input: $input) {
    annualPremium
    monthlyPremium
    coverageOptions {
      type
      included
      premium
    }
  }
}
```

---

### checkServiceEligibility

Determine whether a customer is eligible for a specific service.

```graphql
query CheckServiceEligibility($input: ServiceEligibilityInput!) {
  checkServiceEligibility(input: $input) {
    eligible
    reason
    eligibleServices
    ineligibleServices {
      service
      reason
    }
  }
}
```

---

### processClaim

Evaluate and process an insurance or service claim.

```graphql
query ProcessClaim($input: ClaimInput!) {
  processClaim(input: $input) {
    approved
    approvedAmount
    denialReason
    requiredDocuments
    referenceNumber
  }
}
```

---

### evaluateLoanEligibility

Assess a borrower's eligibility for a loan product.

```graphql
query EvaluateLoanEligibility($input: LoanEligibilityInput!) {
  evaluateLoanEligibility(input: $input) {
    eligible
    maxApprovedAmount
    interestRate
    term
    conditions
    rejectionReasons
  }
}
```

---

### evaluateCreditCardApplication

Evaluate a credit card application and determine the approved credit limit.

```graphql
query EvaluateCreditCardApplication($input: CreditCardApplicationInput!) {
  evaluateCreditCardApplication(input: $input) {
    approved
    creditLimit
    interestRate
    cardType
    conditions
    rejectionReasons
  }
}
```

---

### evaluateEnterpriseLoan

Evaluate a commercial or enterprise loan application.

```graphql
query EvaluateEnterpriseLoan($input: EnterpriseLoanInput!) {
  evaluateEnterpriseLoan(input: $input) {
    eligible
    approvedAmount
    interestRate
    collateralRequired
    conditions
    rejectionReasons
  }
}
```

---

### evaluatePersonalLoan

Evaluate a personal loan application.

```graphql
query EvaluatePersonalLoan($input: PersonalLoanInput!) {
  evaluatePersonalLoan(input: $input) {
    eligible
    approvedAmount
    interestRate
    monthlyRepayment
    term
    conditions
    rejectionReasons
  }
}
```

::: code-group

```bash [curl — evaluatePersonalLoan example]
curl -X POST https://policy.aster-lang.dev/graphql \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: acme-corp" \
  -d '{
    "query": "query EvaluatePersonalLoan($input: PersonalLoanInput!) { evaluatePersonalLoan(input: $input) { eligible approvedAmount interestRate monthlyRepayment term } }",
    "variables": {
      "input": {
        "applicantAge": 32,
        "annualIncome": 68000,
        "creditScore": 710,
        "requestedAmount": 15000,
        "requestedTermMonths": 36
      }
    }
  }'
```

```js [JavaScript — evaluatePersonalLoan example]
const response = await fetch('https://policy.aster-lang.dev/graphql', {
  method: 'POST',
  headers: {
    Authorization:  'Bearer <token>',
    'Content-Type': 'application/json',
    'X-Tenant-Id':  'acme-corp',
  },
  body: JSON.stringify({
    query: `
      query EvaluatePersonalLoan($input: PersonalLoanInput!) {
        evaluatePersonalLoan(input: $input) {
          eligible
          approvedAmount
          interestRate
          monthlyRepayment
          term
          conditions
          rejectionReasons
        }
      }
    `,
    variables: {
      input: {
        applicantAge:        32,
        annualIncome:        68000,
        creditScore:         710,
        requestedAmount:     15000,
        requestedTermMonths: 36,
      },
    },
  }),
});

const { data, errors } = await response.json();
const result = data?.evaluatePersonalLoan;
```

:::
