# Admin.Analytics

**Component**: Instance Analytics and Growth Metrics  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 44 passing tests

---

## 📋 Overview

`Admin.Analytics` visualizes instance activity and growth over time with interactive charts. Administrators can view user growth, post activity, and federation metrics across different time periods (day, week, month). The component provides statistical summaries and visual representations for data-driven decision making.

### **Key Features**:
- ✅ User growth charts
- ✅ Post activity metrics
- ✅ Federation activity tracking
- ✅ Period selection (day, week, month)
- ✅ Bar chart visualizations
- ✅ Statistical summaries (total, average)
- ✅ Responsive charts
- ✅ Loading states
- ✅ Data export
- ✅ Accessible visualizations

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Admin } from '@equaltoai/greater-components-fediverse';
  
  const adminHandlers = {
    onFetchAnalytics: async (period) => {
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      return res.json();
    }
  };
  
  function getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
</script>

<Admin.Root handlers={adminHandlers}>
  <Admin.Analytics />
</Admin.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class |

---

## 📤 Events

```typescript
interface AdminHandlers {
  onFetchAnalytics?: (
    period: 'day' | 'week' | 'month'
  ) => Promise<AnalyticsData>;
}

interface AnalyticsData {
  period: 'day' | 'week' | 'month';
  userGrowth: { date: string; count: number }[];
  postActivity: { date: string; count: number }[];
  federationActivity: { date: string; count: number }[];
}
```

---

## 💡 Examples

Examples include:
- Basic analytics dashboard
- Analytics with export
- Analytics with comparisons
- Real-time analytics updates

---

## 🎨 Styling

Customizable chart colors and layouts.

---

## 🧪 Testing

```bash
npm test -- Admin/Analytics.test.ts
```

---

## 🔗 Related

- [Admin.Root](./Root.md)
- [Admin.Overview](./Overview.md)

---

**For analytics, see the [Admin Components Overview](./README.md).**

