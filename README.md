# sdc

# engineering journal

# Database Selection

- All endpoints search based off of product id and nothing else, so complex queries not necessary
- Chose to use MongoDB

# Extract Transform Load

- used jquery-csv package to convert csv into objects
- Initial implementation read the entire CSV as a string and used library to convert to objects to pass to mongoose
- Initial implementation worked for smaller CSVs but failed for Photos and Skus due to memory constraints
- Made new implementation that read line by line, not moving to new line until insert promise resolves
- Loading takes 2 - 3 hours on my machine, running in 6 separate terminals
- Researched faster loading methods such as mongoimport
- Takes around 15 mins to load all CSVs using mongoimport
- mongoimport does not work with photos.csv due to unclosed double quotes in the file so it turns out my line by line implementation is sometimes needed.


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

# Loaderio 100/second 15s /randomStyle

![First Test 15 seconds 100/s](https://i.ibb.co/NTz5wY1/Screen-Shot-2021-06-28-at-11-23-10-AM.png)
![Fifth Test 15 seconds 100/s](https://i.ibb.co/VMjNfLc/Loaderio.png)

- 453 / 1500 500 errors
- 458 / 1500
- 107 / 1500
- 163 / 1500
- 145 / 1500

# Loaderio 50/second 30s /randomStyle

- 208 / 1463
- 107 / 1500
- 96 / 1404
- 217 / 1458
- 97 / 1403

# Loaderio 30/second 50s /randomStyle

- 108 / 1392
- 131 / 1369
- 196 / 1304

# Loaderio 20/second 60s /randomStyle

- 42 / 1158
- 50 / 1150

# Loaderio 15/second 60s /randomStyle

- 117 / 885
- 86 / 785

# 10/second 60s

- 39 / 561
- 38 / 562

# 5/second 60s

- 11 / 300
- 4 / 300

- Same point of failure as local testing.
- What year is my AWS computer from? 1981? Come on Bezos!
- Results suggest that if I spam the refresh button in the browser, I should be able to generate a 500 eventually but I haven't been able
to do that. Must be more error prone if the requests are coming from all different places.

# Separate ec2 instances

- Easier than expected, simply change mongo uri to instance-ip:27017/atelier, stop server container while leaving mongo container up
- start server container on new EC2 instance
- Did not have to SCP dump dir again!

# Loaderio 100/second 15s Separate EC2

- 20 ms response
- 206 / 1500
- 127 / 1500
- 212 / 1500

# Loaderio 50/second 30s Separate EC2

- 173 / 1500
- 215 / 1500
- 140 / 1500

# Loaderio 30/second 50s Separate EC2

- 159 / 1500
- 105 / 1500

# Loaderio 20/second 60s Separate EC2

- 136 / 1200

# Loaderio 10/second 60s Separate EC2

- 25 / 600
- 56 / 544

# Loaderio 50/second 60s Separate EC2

- 6 / 300
- 41 / 300
- 11 / 289

- Faster response times, consistently 20ms. Exact same error rate.

# Error Rates completely unacceptable!

- Did some research, seems that my implementation with multiple queries and Promise.all overloads the system with pending promises.
- https://eng.lifion.com/promise-allpocalypse-cfb6741298a7
- Scrapped previous /styles route, reimplemented with Model.aggregate
- New implementation means much less work for the server

# Loader.io testing with new implementation

# Loader.io 100/second 15s

- 0 / 1500
- 0 / 1500 13-39 ms avg 15
- 0 / 1500 13-40 ms avg 14
- 0 / 1500 13-34 ms avg 14

# Loader.io 200/second 15s

- 0 / 3000 13-46 ms avg 15
- 0 / 3000 13-36 ms avg 14

# Loader.io 500/second 15s

- 0 / 7062 13-78 ms avg 16
- 0 / 7062 13-63 ms avg 17

# Loader.io 1000/second 15s

- 0 / 11229 14-3123 ms avg 1579
- 0 / 10196 17-4053 ms avg 1730

# Loader.io 750/second 15s

- 0 / 10218 16-686 ms avg 306

# Loader.io 650/second 15s

- 0 / 9750 13-129 avg 28

# Loader.io 600/second 15s

- 0 / 8987 13-128 ms avg 24
- 0 / 8988 13-123 ms avg 23

# Conclusions

- 650 / second is max load where avg response time does not have an upward trending graph
- 650 / second max load with acceptable performance
- Testing indicates API works well enough to proceed to horizontal scaling

# Horizontal Scaling

- Added new server instance
- Added AWS Load Balancer

# Scaled Loader.io 500/second 15s

- 0 / 7062 13-76 ms avg 17
- 0 / 7500 13-79 ms avg 17

# Scaled Loader.io 1000/second 15s

0 / 9814 13-3572 ms avg 1683
0 / 10547 15-3578 ms avg 1737
0 / 9913 14-3349 ms avg 1663

# Scaled Loader.io 750/second 15s

0 / 10614 15-1491 ms avg 370
0 / 10097 13-983 ms avg 326

# Scaled Loader.io 650/second 15s

0 / 9189 13-278 ms avg 36
0 / 9750 13-137 ms avg 24

# Seems tbe max acceptable load stayed the same at 650. I'll add a third instance.

# 3 instance Loader.io 500/second 15s

0 / 7061 13-101 ms avg 18
0 / 7500 13-98 ms avg 17

# Scaled Loader.io 1000/second 15s

0 / 10678 15-3763 ms avg 1679
0 / 10570 14-3715 ms avg 1732

# Scaled Loader.io 750/second 15s

0 / 9741 14-1646 ms avg 555

# I asked Stephen why my test results were exactly the same after launching 3 instances. He suggested to try running longer tests.



# Scaled Loader.io 750/second 60s

![Longer Test](https://i.ibb.co/Z2gqrfb/Longer-Test.png)

- 0 / 42215 13-3188 ms avg 1308 Leveloff in 22 seconds

- 1 / 42396 14-3335 ms avg 1292 Leveloff in 25 seconds

# Scaled Loader.io 1000/second 60s

- 1 / 42648 14-4511 ms avg 2151 Leveloff in 10 seconds

- 1 / 42228 15-4334 ms avg 2166 Leveloff in 11 seconds

# Scaled Loader.io 1500/second 60s

- 2 / 42071 14-6210 ms avg 3519 Leveloff 9 seconds

# Was good advice from Stephen!
- Some of the shorter tests made it appear that response times would continue to snowball until the server became completely unusable. I hadn't given it enough time for the response time to level off.

# Let's run a few tests on the /randomProduct endpoint

- If we can render the basic product info on the page quickly, we'll have a somewhat passable user experience even if the styles request takes a few seconds.

# Scaled Loader.io 750/second 60s

- 1 / 44990 13-240ms avg 16 Leveloff Immediate

# Scaled Loader.io 1000/second 60s

- 1 / 59999 13-128 ms avg 17 Leveloff Immediate

# Scaled Loader.io 1500/second 60s

- 0 / 89981 14-1474 ms avg 81 Peaked at 400ms at 7 seconds, went down and leveled off at 25ms by 14 seconds
- 0 / 89954 14-1231 ms avg 68 Peaked at 480ms at 3 seconds, leveled at 25ms at 10 seconds

# Scaled Loader.io 2000/second 60s

- 6 / 94224 19-10208 ms avg 1945ms No Peak Leveloff 6 seconds at 2000ms

## Final Analysis of 3 instance Performance

- Product info response time good up to 1500 requests per second
- Styles info response time good up to 1000 requests per second, marginal performance up to 1500 per second.
- Styles api called much more than product info and with its worse performance is an obvious bottleneck.
- Loading the webpage requires 9 calls to the styles route in the current front end implementation.
- Subsequent requests can be reduced using client side caching with localStorage.
- My somewhat educated guess is that with front-end caching, the average page load will make 3 calls to styles.
- After our wonderful front-end dev implements caching on the front end, the 3 instance implementation of the Products service should handle 300 to 400 users loading the page per second.

# Now that we have our testing procede refined, lets scale up to 6 instances

# 6 Instance Loader.io 1000/second 60s

- 0 / 39002 14-5406 ms avg 2411 Leveloff 7 sec 2500ms
- 0 / 39903 15-5535 ms avg 2332 Leveloff 7 sec 2500ms

# 6 Instance Loader.io 1500/second 60s

- 2 / 39427 14-7334 ms avg 3787 Leveloff 11 sec 4000 ms
- 0 / 38976 15-6781 ms avg 3757 Leveloff 8 sec 4000 ms

# 6 Instance Loader.io 2000/second 60s

- 1 / 39142 16-9439 ms avg 5053 Leveloff 9 sec 5500 ms
- 0 / 39392 16-9924 ms avg 5063 Leveloff 9 sec 5500 ms


### Conclusions

- Response times are not improving proportionally with horizontal scaling
- Response times not improving much at all in fact

# Adding authentication

- Unsecured MongoDB deployment was emptied by hackers demanding $1000 in bitcoin
- Repaired DB is about 15 min using mongorestore
- Added authentication to DB after emailing the hackers my best Hindi curses
