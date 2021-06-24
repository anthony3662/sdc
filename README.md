# sdc

# engineering journal

# Local Stress testing
- Stress testing done on styles route with randomized product ids
- 1 in 2000 requests fail at 100 requests per second
- 1 in 250 requests fail at 200 requests per second
- Reliability is worst on the first 500 requests after server is started, 1 in 25 fail at 200 rps, goes down to 1 in 200 on the second batch of 500 requests.
- Failure point seems to be Promise.all, then block running before promise results array fully populates