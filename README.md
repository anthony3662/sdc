# sdc

# engineering journal

# Local Stress testing with axios requests
- Stress testing done on styles route with randomized product ids
- 1 in 2000 requests fail at 100 requests per second
- 1 in 250 requests fail at 200 requests per second
- Reliability is worst on the first 500 requests after server is started, 1 in 25 fail at 200 rps, goes down to 1 in 200 on the second batch of 500 requests.
- Failure point seems to be Promise.all, then block running before promise results array fully populates

# Local Stress testing with httperf
- Seems to have better results when using httperf
- 1 in 1000 fail at 200 requests per second
- Same failure point
- Test output:
    Total: connections 3000 requests 3000 replies 3000 test-duration 14.999 s

    Connection rate: 200.0 conn/s (5.0 ms/conn, <=6 concurrent connections)
    Connection time [ms]: min 1.0 avg 3.4 max 28.0 median 3.5 stddev 1.3
    Connection time [ms]: connect 0.2
    Connection length [replies/conn]: 1.000

    Request rate: 200.0 req/s (5.0 ms/req)
    Request size [B]: 73.0

    Reply rate [replies/s]: min 200.0 avg 200.0 max 200.0 stddev 0.0 (2 samples)
    Reply time [ms]: response 3.2 transfer 0.0
    Reply size [B]: header 237.0 content 2673.0 footer 0.0 (total 2910.0)
    Reply status: 1xx=0 2xx=2997 3xx=0 4xx=0 5xx=3

    CPU time [s]: user 3.91 system 11.06 (user 26.0% system 73.7% total 99.8%)
    Net I/O: 582.8 KB/s (4.8*10^6 bps)

    Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
    Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0