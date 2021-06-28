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

# Docker Containers

- Went through Docker tutorials and set up server and db in seperate containers
- Initial docker deployment went smoothly and api worked
- AWS computers are slower than mine and fully seeding the database would have taken 12+ hours

# Making it more scalable

- Wanted to find a more scalable database seeding solution
- Used mongodump to make a dump directory, scp transferred to EC2
- Build says out of disk space
- Made new EC2 instance with 16GB, build failed again.
- Used docker commit to create image with copied in file system already in place and scp transferred to EC2
- Build suceeded but EC2 instance crashed during DB seeding
- Made EC2 instance with 30GB, things worked.
- Played around with the file system some, the server container uses the EC2 copy of mongoContainer
- Mongo container has own copy of mongoContainer, will look into how to make it use the EC2 copy
- Still doesn't explain why the 16GB instance didn't work, 2 copies of the 4.5GB dump, everything should still stay under 11 GB
- mongorestore after docker exec into mongo container to seed the db, 10 mins or so to complete
- Wanted docker to call mongorestore for me, but docker doesn't want to do that. Whatever I try, it's connection to p 27017 refused.
- API works and can start deployment testing. Still want to know why I can type mongorestore myself without issue but docker won't do it for me.

# Loaderio

![First Test 15 seconds 100/s](https://i.ibb.co/NTz5wY1/Screen-Shot-2021-06-28-at-11-23-10-AM.png)