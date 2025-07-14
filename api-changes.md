# Case Management System - External Service Integration

## Overview

This document specifies the implementation requirements for integrating external service links in the Case Management System's case detail page (`src/pages/cases/[id].tsx`). The system should dynamically link to external services for transaction evidence and customer data based on configuration APIs.

## Architecture Context

The Case Management System operates as a configurable evidence management platform where:

- **Cases** contain evidence from various source systems (FRM, etc.)
- **Evidence** can be transactions, alerts, or other data types
- **Customer data** comes from external source systems
- **Configuration APIs** define how to link to external services

## Required Changes

### 1. Transaction Details Section Enhancement

**Target Component**: Transaction Details Card in `src/pages/cases/[id].tsx` (lines ~565-600)

**Current State**: Static transaction table with view details dialog
**Required State**: Dynamic links to external evidence systems

**Implementation Requirements**:

#### A. Fetch Evidence Configuration

- Add API call to: `GET /api/config/evidences?source_system={sourceSystem}&evidence_type=transaction`
- Response contains `external_link_config` with URL patterns and display settings
- Cache configuration per source system + evidence type combination

#### B. Add External Link Column

- Add new column to `transactionColumns` array: "External Link"
- Column should render clickable links/buttons for each transaction
- Link text: "View in {source_system_name}" (e.g., "View in FRM")
- Link URL: Constructed from config template + transaction evidence_id

#### C. URL Construction Logic

```typescript
// Example implementation
const constructExternalUrl = (evidenceConfig: EvidenceConfig, evidenceId: string): string => {
  return evidenceConfig.external_link_template.replace('{evidence_id}', evidenceId);
}

// Example config response:
{
  "external_link_template": "https://frm-system.company.com/transactions/{evidence_id}",
  "display_name": "FRM System",
  "open_in_new_tab": true
}
```

#### D. UI Components

- Add external link icon (ExternalLink from lucide-react)
- Links should open in new tab/window
- Show loading state while fetching config
- Handle cases where external link config is unavailable

### 2. Customer Details Section Enhancement

**Target Component**: Customer Details Card in `src/pages/cases/[id].tsx` (lines ~890-950)

**Current State**: Static customer information display
**Required State**: Dynamic link to external customer source system

**Implementation Requirements**:

#### A. Fetch Source Configuration

- Add API call to: `GET /api/config/sources` filtered by source_system
- Response contains `source_api.external_link_config` with customer portal URLs
- Use customer_id or entity_id for URL construction

#### B. Add Customer Portal Link

- Add "View in Customer Portal" button/link below customer details
- Position: After card status, before debit card type
- Style: Outline button with external link icon
- URL: Constructed from source config + customer_id

#### C. URL Construction Logic

```typescript
// Example implementation
const constructCustomerUrl = (sourceConfig: SourceConfig, customerId: string): string => {
  return sourceConfig.source_api.customer_portal_url.replace('{customer_id}', customerId);
}

// Example config response:
{
  "source_api": {
    "customer_portal_url": "https://customer-portal.company.com/customers/{customer_id}",
    "display_name": "Customer Portal"
  }
}
```

### 3. API Integration Points

#### New API Hooks Required

Create these hooks in `src/hooks/use-api.ts`:

```typescript
// Fetch evidence configuration for external links
export const useEvidenceConfig = (
  sourceSystem: string,
  evidenceType: string
) => {
  return useQuery({
    queryKey: ["evidenceConfig", sourceSystem, evidenceType],
    queryFn: () =>
      apiClient.get(
        `/config/evidences?source_system=${sourceSystem}&evidence_type=${evidenceType}`
      ),
  });
};

// Fetch source configuration for customer portal links
export const useSourceConfig = (sourceSystem: string) => {
  return useQuery({
    queryKey: ["sourceConfig", sourceSystem],
    queryFn: () =>
      apiClient.get(`/config/sources?source_system=${sourceSystem}`),
  });
};
```

#### API Endpoints (Backend - for reference)

- `GET /api/config/evidences` - Returns evidence configuration including external link templates
- `GET /api/config/sources` - Returns source system configuration including customer portal URLs

### 4. Data Flow

#### Evidence External Links

1. Case loads with evidence data containing `source_system` and `evidence_type`
2. Fetch evidence config using source_system + evidence_type
3. For each evidence item, construct external URL using evidence_id
4. Render external link in transaction table

#### Customer Portal Links

1. Case loads with customer data containing `source_system`
2. Fetch source config using source_system
3. Construct customer portal URL using customer_id
4. Render "View in Customer Portal" link in customer details section

### 5. Error Handling

- **Config API Unavailable**: Hide external links, show only internal data
- **Invalid URL Template**: Log error, don't render broken links
- **Missing Evidence ID**: Show disabled link state
- **Network Timeouts**: Show retry mechanism for config fetching

### 6. UI/UX Requirements

#### Visual Design

- External links should have consistent styling across sections
- Use ExternalLink icon consistently
- Maintain current layout structure
- Links should be visually distinguishable from internal navigation

#### Accessibility

- Proper ARIA labels for external links
- Screen reader announcements for new tab/window opening
- Keyboard navigation support

#### Loading States

- Show skeleton/loading indicators while fetching configurations
- Graceful degradation when configs are unavailable

### 7. Implementation Priority

1. **Phase 1**: Evidence external links in transaction table
2. **Phase 2**: Customer portal links in customer details
3. **Phase 3**: Error handling and loading states optimization
4. **Phase 4**: Caching and performance optimization

### 8. Configuration Examples

#### Evidence Config Response

```json
{
  "data": [
    {
      "id": 1,
      "source_system": "frm",
      "evidence_type": "transaction",
      "external_link_config": {
        "url_template": "https://frm-dashboard.company.com/transactions/{evidence_id}",
        "display_name": "FRM Dashboard",
        "icon": "external-link",
        "open_in_new_tab": true
      }
    }
  ]
}
```

#### Source Config Response

```json
{
  "data": [
    {
      "id": 1,
      "source_system": "frm",
      "entity_type": "customer",
      "external_link_config": {
        "customer_portal_url": "https://customer-portal.company.com/customers/{customer_id}",
        "display_name": "Customer Portal",
        "open_in_new_tab": true
      }
    }
  ]
}
```

## Acceptance Criteria

✅ **Transaction Evidence Links**

- [ ] External link column added to transaction table
- [ ] Links constructed from evidence config API
- [ ] Links open in new tab with proper security attributes
- [ ] Graceful handling when config unavailable

✅ **Customer Portal Links**

- [ ] "View in Customer Portal" button added to customer details
- [ ] Link constructed from source config API
- [ ] Proper loading and error states

✅ **Technical Requirements**

- [ ] New API hooks implemented
- [ ] Proper TypeScript types defined
- [ ] Error boundaries for config failures
- [ ] Accessibility compliance maintained

✅ **User Experience**

- [ ] Consistent visual design
- [ ] Clear indication of external navigation
- [ ] Performance optimized (config caching)
- [ ] No breaking changes to existing functionality

graph TD
A["Case Detail Page<br/>/cases/[id]"] --> B["Load Case Data"]
B --> C["Extract source_system"]

    C --> D["Fetch Evidence Config<br/>/api/config/evidences"]
    C --> E["Fetch Source Config<br/>/api/config/sources"]

    D --> F["Evidence Config Response<br/>url_template, display_name"]
    E --> G["Source Config Response<br/>customer_portal_url"]

    F --> H["Transaction Table"]
    H --> I["External Link Column<br/>View in FRM"]
    I --> J["https://frm-system.com/transactions/{evidence_id}"]

    G --> K["Customer Details Card"]
    K --> L["Customer Portal Button<br/>View in Customer Portal"]
    L --> M["https://customer-portal.com/customers/{customer_id}"]

    N["Error Handling"] --> O["Config API Down"]
    N --> P["Invalid URL Template"]
    N --> Q["Missing Evidence ID"]

    O --> R["Hide External Links"]
    P --> S["Log Error, No Broken Links"]
    Q --> T["Show Disabled State"]
