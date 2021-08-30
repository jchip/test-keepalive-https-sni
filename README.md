# test-keepalive-https-sni

terminal 1:

`fun server`

terminal 2:

`fun test`

Server output:

- SNI servername should match host header
- First and last remote port should be the same
- Second remote port should be different

```
fastify listening
socket remote address port 127.0.0.1 55281 use count 1 total sockets 1 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55282 use count 1 total sockets 2 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55283 use count 1 total sockets 3 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55284 use count 1 total sockets 4 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55285 use count 1 total sockets 5 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55286 use count 1 total sockets 6 SNI servername localhost1 host header localhost1:8443
socket remote address port 127.0.0.1 55287 use count 1 total sockets 7 SNI servername localhost1 host header localhost1:8443
```
