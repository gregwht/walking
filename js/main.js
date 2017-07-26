//main.js

// Set up an array of zones
var zoneData = [{
        name: 'zone1',
        lat1: 51.5000,
        lat2: 51.5009,
        long1: -0.1276,
        long2: -0.1268,
        audio: ["1_Testing.mp3",
            "2_EnteringMoL.mp3",
            "3_Sound_Squeak.mp3",
            "4_Spot_The_Terrorist.mp3",
            "5_Meeting_Brian.mp3",
            "6_Brian_Introduces_Himself.mp3",
            "7_Brian_I'm_An_Old_Man.mp3"
        ]

    },

    {
        name: 'zone2',
        lat1: 51.5010,
        lat2: 51.5020,
        long1: -0.1276,
        long2: -0.1268,
        audio: ["1_Testing.mp3",
            "2_EnteringMoL.mp3",
            "3_Sound_Squeak.mp3",
            "4_Spot_The_Terrorist.mp3",
            "5_Meeting_Brian.mp3",
            "6_Brian_Introduces_Himself.mp3",
            "7_Brian_I'm_An_Old_Man.mp3"
        ]

    }, {
        name: 'zone3',
        lat1: 51.5000,
        lat2: 51.5009,
        long1: -0.1267,
        long2: -0.1261,
        audio: ["1_Testing.mp3",
            "2_EnteringMoL.mp3",
            "3_Sound_Squeak.mp3",
            "4_Spot_The_Terrorist.mp3",
            "5_Meeting_Brian.mp3",
            "6_Brian_Introduces_Himself.mp3",
            "7_Brian_I'm_An_Old_Man.mp3"
        ]
        
    }, {
        name: 'zone4',
        lat1: 51.5010,
        lat2: 51.5020,
        long1: -0.1267,
        long2: -0.1261,
        audio: ["1_Testing.mp3",
            "2_EnteringMoL.mp3",
            "3_Sound_Squeak.mp3",
            "4_Spot_The_Terrorist.mp3",
            "5_Meeting_Brian.mp3",
            "6_Brian_Introduces_Himself.mp3",
            "7_Brian_I'm_An_Old_Man.mp3"
        ]
    }
]

var walkAudio = ["1_Testing.mp3", 
                 "2_EnteringMoL.mp3"]


// Declare variables
var locationData;   // Coordinates, speed, etc
var currentZone;    // What zone the user is in
var walking;        // Whether the user is walking or not
var currentStatus;  // Used to detect whether there has been a change between walking and standing still

var latMin = 51.5000;    // Minimum latitude value
var latMax = 51.5020;    // Maximum latitude value
var longMin = -0.1276;   // Minimum longitude value  
var longMax = -0.1261;   // Maximum longitude value

var zoneAudioPlayer;    // When still, plays zone audio
var walkAudioPlayer;    // When walking, plays transition audio


// Initialising 
function init() {

    // Link players to the relevant HTML5 audio tags
    zoneAudioPlayer = document.getElementById('zoneAudioTag');
    walkAudioPlayer = document.getElementById('walkAudioTag');

    // Get our location information
    getCoords();

}


// Get our location information
function getCoords() {

    // Refreshes every second
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(setCoords, error, { maximumAge: 1000, timeout: 1000, enableHighAccuracy: true });
    }
}


// Set coordinates so we can see them
function setCoords(e) {

    console.log(e);
    locationData = e.coords;

    // Check whether we are in a zone
    checkZone();
}


// Something's gone wrong!
function error() {
    console.log('Aw beans...something\'s gone wrong!');
}


function checkSpeed() {


    // Detect if user is walking
    if (locationData.speed >= 0.5) {

        walking = true;

        // If they weren't walking before, play walk audio and fade it in
        if (currentStatus != walking) {
            console.log('User is walking.')
            playWalkAudio();
            crossFade();
        }


    } else if (locationData.speed < 0.5) {

        walking = false;
        
        // If they are now standing still, play zone audio and fade it in
        if (currentStatus != walking) {
            console.log('User is standing still.')
            playZoneAudio();
            crossFade();
        }
        
    }

    // Log whether we ware walking or not
    currentStatus = walking;
}


// Check whether we are in a zone
function checkZone() {

    console.log('Zone is being checked.');

    // For all of the zones in our array...
    for (var i = 0; i < zoneData.length; i++) {

        // If we are within the bounds of a zone...
        if (locationData.latitude > zoneData[i].lat1 && 
            locationData.latitude < zoneData[i].lat2 && 
            locationData.longitude > zoneData[i].long1 && 
            locationData.longitude < zoneData[i].long2) {

            // ...and that zone is NOT the same as the last time we checked...
            if (!currentZone || currentZone.name != zoneData[i].name) {
                
                // WE'RE IN A NEW ZONE!
                currentZone = zoneData[i];
                console.log('New zone: ' + currentZone.name);
                
                // So if we are standing still...
                if (locationData.speed < 0.5){
                    
                    // Play zone audio
                    playZoneAudio();
                }

            // ...and that zone IS the same as the last time we checked...
            } else {

                // We're in the same zone...chill out.
                console.log('Same zone: ' + currentZone.name);
                return false;
            }



        } else if ((locationData.latitude > latMax || locationData.latitude < latMin) && 
                   (locationData.longitude > longMax || locationData.longitude < longMin)) {

            console.log('You\'re not in Parliament Square.');
        }

    }

}


// Does what it says on the tin
function playZoneAudio() {

    console.log('Zone ' + currentZone + ' audio is being played');

    // Select a random audio file to play from the zone's array of audio files
    var nextAudio = currentZone.audio[Math.round(Math.random() * (currentZone.audio.length - 1))];
    zoneAudioPlayer.src = './assets/' + nextAudio;
}

// Same as above for walking audio
function playWalkAudio() {

    console.log('Walk audio is being played');

    // Select a random audio file to play from the zone's array of audio files
    var nextAudio = walkAudio[Math.round(Math.random() * (walkAudio.length - 1))];
    walkAudioPlayer.src = './assets/' + nextAudio;
}

// Crossfade smoothly between audio files
function crossFade() {

    var decreasing; // Audio player to fade down
    var increasing; // Audio player to fade up

    // If walking, we want to fade up the walk audio
    if (walking){

        decreasing = zoneAudioPlayer;
        increasing = walkAudioPlayer;

    // If standing still, we want to fade up the zone audio
    } else if (!walking){

        decreasing = walkAudioPlayer;
        increasing = zoneAudioPlayer;
    }


    var steps = 10;
    var step = 0;

    var cross = setInterval(function() {


        decreasing.volume = 1 - step * 0.1;
        increasing.volume = step * 0.1;

        step++;

        if (step == steps) {
            clearInterval(cross);
        }

    }, 1000);

    // Pause the faded-out audio and reset it to the beginning
    decreasing.pause;
    decreasing.currenTime = 0;
}
