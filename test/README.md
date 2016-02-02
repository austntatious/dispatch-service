Create Driver:
$ curl --data "firstName=Austin&lastName=Tse&phone=911" http://localhost:3000/api/drivers

Update Driver:
$ curl -H 'Content-Type: application/json' -X POST -d '{"location":["50.7392534","-74.0030267"],"onDuty":"true"}' http://localhost:3000/api/drivers/driver:609aa0ce3ab1