# Lesser Live API Setup Guide

**API Endpoint:** `https://dev.lesser.host/api/graphql` ✅ **LIVE**  
**WebSocket:** `wss://dev.lesser.host/api/graphql`

---

## Quick Start

### 1. Get Your Auth Token

You'll need a Lesser account token to use the API. Store it securely:

```javascript
// In browser console or app initialization
localStorage.setItem('lesser_token', 'your-auth-token-here');
```

### 2. Initialize the GraphQL Adapter

```typescript
import { createLesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://dev.lesser.host/api/graphql',
	wsEndpoint: 'wss://dev.lesser.host/api/graphql',
	token: localStorage.getItem('lesser_token') || '',
	debug: true,
});
```

### 3. Start Making Queries

```typescript
// Get followers
const followers = await adapter.getFollowers('username', 40);
console.log(`${followers.totalCount} followers found`);

// Get user preferences
const prefs = await adapter.getUserPreferences();
console.log('Default visibility:', prefs.posting.defaultVisibility);

// Check push subscription
const push = await adapter.getPushSubscription();
console.log('Push enabled:', !!push);
```

---

## Testing the Examples

### ProfilePageExample

1. Set your Lesser token:

```javascript
localStorage.setItem('lesser_token', 'your-token');
```

2. Run the playground:

```bash
pnpm --filter @equaltoai/playground dev
```

3. Navigate to the Profile example and it will automatically use the live API!

### PreferencesExample

Same setup - just set `lesser_token` in localStorage and the example will connect to the live API.

### PushNotificationsExample

For push notifications, you'll also need:

1. A registered service worker
2. Browser notification permission
3. VAPID public key from Lesser (ask the team)

---

## Verifying the Connection

### Test with curl

```bash
curl -X POST https://dev.lesser.host/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"{ __typename }"}'
```

Expected response:

```json
{ "data": { "__typename": "Query" } }
```

### Test with GraphQL Playground/Altair

1. Open GraphQL client (Altair, Insomnia, etc.)
2. Set endpoint: `https://dev.lesser.host/api/graphql`
3. Add header: `Authorization: Bearer YOUR_TOKEN`
4. Run introspection query to explore the schema

---

## Available Operations

With the live API, you can now test all the GraphQL operations we implemented:

### ✅ Followers & Following

```graphql
query {
	followers(username: "alice", limit: 10) {
		actors {
			id
			username
			displayName
		}
		totalCount
		nextCursor
	}
}
```

### ✅ User Preferences

```graphql
query {
	userPreferences {
		posting {
			defaultVisibility
		}
		reading {
			expandMedia
		}
		streaming {
			defaultQuality
		}
	}
}
```

### ✅ Push Subscriptions

```graphql
query {
	pushSubscription {
		id
		endpoint
		alerts {
			follow
			mention
		}
	}
}
```

### ✅ Profile Updates

```graphql
mutation {
	updateProfile(input: { displayName: "New Name", bio: "New bio" }) {
		id
		displayName
		summary
	}
}
```

---

## Rate Limits & Quotas

Check with the Lesser team for:

- Rate limits (queries per minute)
- Concurrent connection limits
- WebSocket subscription limits
- Any cost/quota restrictions

---

## Debugging

### Enable Debug Mode

```typescript
const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://dev.lesser.host/api/graphql',
	wsEndpoint: 'wss://dev.lesser.host/api/graphql',
	token: yourToken,
	debug: true, // <-- Enables console logging
});
```

Debug mode will log:

- All GraphQL requests and responses
- WebSocket connection events
- Cache hits and misses
- Error details

### Check Network Tab

Open browser DevTools → Network tab to inspect:

- GraphQL request payloads
- Response data
- Timing information
- Error details

### Common Issues

**401 Unauthorized**

- Token expired or invalid
- Token not included in Authorization header
- Check token format: `Bearer YOUR_TOKEN`

**Network Error**

- Check internet connection
- Verify endpoint URL is correct
- Check for CORS issues (should be handled server-side)

**GraphQL Validation Error**

- Query doesn't match schema
- Run `pnpm graphql-codegen` to regenerate types
- Check if you're using deprecated fields

---

## Environment Configuration

### Development

```typescript
const adapter = createLesserGraphQLAdapter({
	httpEndpoint: 'https://dev.lesser.host/api/graphql',
	wsEndpoint: 'wss://dev.lesser.host/api/graphql',
	token: import.meta.env.VITE_LESSER_TOKEN,
	debug: true,
});
```

### Production

```typescript
const adapter = createLesserGraphQLAdapter({
	httpEndpoint: import.meta.env.VITE_LESSER_GRAPHQL_ENDPOINT,
	wsEndpoint: import.meta.env.VITE_LESSER_GRAPHQL_WS_ENDPOINT,
	token: getUserToken(), // From your auth system
	debug: false,
});
```

Add to `.env`:

```bash
VITE_LESSER_GRAPHQL_ENDPOINT=https://dev.lesser.host/api/graphql
VITE_LESSER_GRAPHQL_WS_ENDPOINT=wss://dev.lesser.host/api/graphql
```

---

## Security Best Practices

1. **Never commit tokens** - Use environment variables
2. **Rotate tokens regularly** - Implement token refresh
3. **Use HTTPS only** - Never use HTTP for GraphQL endpoints
4. **Sanitize inputs** - Validate all user inputs before queries
5. **Handle errors gracefully** - Don't expose internal errors to users

---

## Next Steps

Now that the live API is available:

1. ✅ **Test our integration** - Verify all queries work with real data
2. ✅ **Performance testing** - Check response times and caching
3. ✅ **Error scenarios** - Test with invalid data, network issues
4. ✅ **WebSocket stability** - Test subscription reliability
5. ✅ **Load testing** - Verify pagination works with large datasets

---

## Support

For API issues or questions:

- Check Lesser API documentation
- Contact Lesser team for API keys/tokens
- Report GraphQL schema issues upstream

For Greater Components integration issues:

- See [GraphQL Integration Guide](./components/Profile/GraphQL-Integration.md)
- Check [examples](../apps/playground/stories/examples/)
- File issue on Greater Components repo

---

**API Status:** ✅ **LIVE AND READY**  
**Updated:** October 31, 2025  
**Endpoint:** `https://dev.lesser.host/api/graphql`
