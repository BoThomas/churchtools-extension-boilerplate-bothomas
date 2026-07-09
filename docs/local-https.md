# Local HTTPS certificates

ChurchTools extensions run over HTTPS. The demo Vite config looks for these files:

- `certs/localhost.pem`
- `certs/localhost-key.pem`

Create them with [mkcert](https://github.com/FiloSottile/mkcert):

```bash
mkcert -install
mkdir -p certs
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

The `certs/` folder is ignored by Git.
