Curling Endpoints

Company
--------

Create Company:
$ curl --data "name=Chase&phone=555-555-5555&address=New+York" http://localhost:3000/api/company

List Companys:
$ curl http://localhost:3000/api/company


Driver
------

Create Driver:
$ curl --data "firstName=Austin&lastName=Tse&phone=911" http://localhost:3000/api/drivers

Update Driver:
$ curl -H 'Content-Type: application/json' -X POST -d '{"location":["50.7392534","-74.0030267"],"onDuty":"true"}' http://localhost:3000/api/drivers/driver:609aa0ce3ab1

List Drivers:
$ curl http://localhost:3000/api/drivers
