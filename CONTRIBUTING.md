# Contributing

## Local Development

For local development with custom domain:

```bash
NODE_ENV=development npm run dev -- --host
```

This enables the development server to accept requests from rsousa.co.

Required entry in /etc/hosts:
```bash
127.0.0.1 rsousa.co
```
