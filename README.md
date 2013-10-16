# Bazaarvoice Hello World
This is a reference application for the Bazaarvoice Conversations API.

The application periodically fetches recent reviews using the Bazaarvoice Conversations API and displays reviews using Google Earth.
It demonstrates a client-side mash-up of the following three API's:

1. [Bazaarvoice Conversations API](https://developer.bazaarvoice.com/docs/read/conversations)
2. [Google Earth and JS API](https://developers.google.com/earth/)
3. [Smart-IP.net Geo-IP API](http://smart-ip.net/geoip-api)

The application uses JSONP to make requests to the Bazaarvoice Conversations API and the Smart-IP.net Geo-IP API.

## Set up
In order to run the application, do the following:

1. Get the code from github (download or clone)
2. Obtain Bazaarvoice Conversations API keys:
 * Obtain a Bazaarvoice API key from [http://developer.bazaarvoice.com](http://developer.bazaarvoice.com ) (Request that your key is granted access to IP address information)
3. Configure the Bazaarvoice Conversations API in scripts/earth_reviews.js
 * Replace `BAZAARVOICE_HOSTNAME` with one of the following:
    * __staging data__: stg.api.bazaarvoice.com
    * __production data__: api.bazaarvoice.com
 * Replace `YOUR_BAZAARVOICE_API_KEY` with your Bazaarvoice staging or production API key
4. Open index.html in a browser
5. Install the Google Earth plug-in, unless you already have it, and refresh the page.
 * Google Earth works on Windows and Apple OS

## About the Geo-IP API & rate limiting

Smart-IP.net graciously offers their Geo-IP API for free with a limit of 5000 requests per requester per day. The limit is tied to the IP address of the devise making the requests. The Bazaarvoice Hello World app makes approximately 4800 requests to the Geo-IP API per day. If for some reason the limit is exceeded you may take the following steps:

1. Increase the interval between requests by modifying the setInterval() function at the bottom of scripts/earth_reviews.js
2.  Contact Smart-IP.net following the instructions at http://smart-ip.net/write-to-us

## Troubleshooting
1. The Google Earth plug-in works best in Google Chrome
2. If stars do not display in 60 seconds try restarting your browser
3. Confirm that your  `BAZAARVOICE_HOSTNAME` and `YOUR_BAZAARVOICE_API_KEY` are for the same environment (staging or production) and are configured correctly

## Support
Still having trouble? Ask for [help](https://developer.bazaarvoice.com/forum).