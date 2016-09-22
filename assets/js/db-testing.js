$(document).ready(function() {

  /* Notes:
   * Data we need in db:
   * unique userId (key)
      -userName
      -userEmail
      -favCategories
      -(category name)
        -
  */

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA9gw81RM2br5S9X55E0G6ZGjJMo1oDVRs",
    authDomain: "eventi-testing-db.firebaseapp.com",
    databaseURL: "https://eventi-testing-db.firebaseio.com",
    storageBucket: "eventi-testing-db.appspot.com",
    messagingSenderId: "393804341426"
  };
  firebase.initializeApp(config);
  
  // Establish easy access to db object
  var db = firebase.database();
  
  // Establish database references
  var usersRef = db.ref("users");
  var nameRef = db.ref("users/name")
  var musicRef = db.ref("users").child("favCategories");
  
  // Retrieve every user's information on page load
  usersRef.on('child_added', function(snapshot) {
    var content = "<p> User key: " + snapshot.key + " User name: " + snapshot.val().name + " User email: " + 
    snapshot.val().email + " User favCategories: " + snapshot.val().favCategories + "</p>";
    $('.drunk-ass-div').append(content);
  });

  // Retrieve just the first two users' information
  usersRef.limitToFirst(2).on('child_added', function(snapshot) {
    var content = "<p> User key: " + snapshot.key + " User name: " + snapshot.val().name + " User email: " + 
    snapshot.val().email + " User favCategories: " + snapshot.val().favCategories + "</p>";
    $('.first-user').append(content);
  });

  // Retrieve all favorites for user 757827487
 // usersRef.child('757827487').child("favCategories").on('child_added', function(snapshot) {
  /*
  usersRef.child('757827487').on('child_added', function(snapshot) {
    var content = "<p>";
    var userName = snapshot.val().name;
    var fav = "";
    snapshot.val().favCategories.forEach(function(item, index, arr) {
      fav += "<span> Category: " + index + " Description: " + item.desc + "</span>";
    });
    content += userName + fav + "</p>";
    $('.faves').append(content);
  });*/
  
  usersRef.child('757827487').child("favCategories").on('child_added', function(snapshot) { 
    var content = "<p>";
    var faveCat = snapshot.key + ":<br>";
    var event = "";
    snapshot.val().forEach(function(item, index, arr) {
      event += "<span> Description: " + item.desc + "</span><br>";
    });
    content += faveCat + event + "</p>";
    $('.faves').append(content);
  });  

    /* This is the actual starter database (may have added/altered since)
    db.ref().set({
      users: {
        4738473827: {
          name: "Jeff",
          email: "mt@m.com",
          favCategories: {
            "DC Trip": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                Time: "7:15pm",
                desc: "Presentation by author Michael Reyes, where he discusses the livelihood of hog farming.",
                location: "2025 E 7th St, Washington, DC 20002"
              },

              {
                name: "Jazz in the Garden",
                date: "07/08/16",
                time: "5:30pm",
                desc: "Get down with some funk jazz, courtesy of the Robert Hickman band, man!",
                location: "700 Georgia St, Austin, Tx 78702"
              },
              
              {
                name: "Nasty Cereal",
                date: "07/10/16",
                time: "7:00pm",
                desc: "Author Michael Pollen explains why eating cereal is bad for you in the engaging presentation.",
                location: "Haper Ave, Austin, TX 23438"
              }
            ],
          
            "October Must-Dos": [
              {
                name: "Sun Britches",
                date: "10/01/16",
                time: "7:00pm",
                desc: "Scientist Sarah Gaslschak explains why being out in the sun is healthy for you.",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Fayyyce",
                date: "10/07/16",
                time: "4:30pm",
                desc: "A modern play satirizing the popularity of dogs.",
                location: "13 Bitch St, Houston, TX 28394"
              },
              
              {
                name: "The Dodge Paradox",
                date: "10/15/16",
                time: "10:00am",
                desc: "Watch a movie about the only dodge project ever that was aimed at producing a spaceship.",
                location: "10 Service St, Washi"
              }
            ],

            "Spring '16 NYC Trip": [
              {
                name: "Blades of Soccer",
                date: "03/07/16",
                time: "07:15pm",
                desc: "Go down in blades of glory, with Brazil football club celebration, man!",
                location: "1 NYC Drive, New York, NY 28391 "
              },
              
              {
                name: "The Mormon Tabernacle",
                date: "03/09/16",
                time: "8:15pm",
                desc: "Sing hymns with the mormon historical society!",
                location: "10 Geneve St, New York, NY 39405"
              },
              
              {
                name: "Pinballs Over Brooklyn",
                date: "03/10/16",
                time: "5:30pm",
                desc: "Go see a bunch of vintage pinball machines!",
                location: "12 Balls St, New York, NY 94839"
              }
            ]
          } // favCategories
        },

        757827487: {
          name: "Michael",
          email: "m@h.com",
          favCategories: {
            "Bday Month": [
              {
                name: "DJ Strong",
                date: "09/10/16",
                time: "9:00pm",
                desc: "Celebrate your birthday with DJ Strong!",
                location: "Bday St, Austin, TX 48372"
              },
              
              {
                name: "Blades of Z",
                date: "09/11/16",
                time: "6:45pm",
                desc: "See the new men's razor blades Blades of Z exhibit.",
                location: "12 Harris St, Austin, TX 78702"
              },
              
              {
                name: "Tony Hawk Competition",
                date: "09/13/16",
                time: "3:30pm",
                desc: "Go play Tony Hawk like you used to, against other Tony Hawk enthusiasts!",
                location: "45 Box St, Austin, TX 43432"
              }
            ],
  
            "Nov '16 Fall Trip": [
              {
                name: "Blades of 1",
                date: "11/07/16",
                time: "7:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 2",
                date: "07/07/16",
                time: "5:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 3",
                date: "07/07/16",
                time: "5:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            "LR Work Trip" : [
              {
                name: "Blades of 1",
                date: "07/07/16",
                time: "8:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 2",
                date: "07/07/16",
                time: "5:45pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of 3",
                date: "07/07/16",
                time: "4:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        },

        888828838: {
          name: "Harry",
          email: "m@harry.com",
          favCategories: {
            "Piano Fest": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                time: "10:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Jazz",
                date: "07/07/16",
                time: "6:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Nast",
                date: "07/07/16",
                time: "4:45pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            "Music To See": [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                time: "8:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                time: "8:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                time: "9:00pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            "Plays To See": [
              {
                name: "Blades of The Sista",
                date: "07/22/16",
                time: "9:00pm",
                desc: "Play commenting on the social norm of 'couter-challenging' in America.",
                location: "2025 E 7th St, Austin, TX 894838"
              },
              
              {
                name: "Golf's Greatest Mysteries",
                date: "11/07/16",
                time: "8:30pm",
                desc: "Watch the infamous Isaac Bich Take on Rutherford B. Hayes.",
                location: "80 Jefferson St, Austin, TX 38473"
              },
              
              {
                name: "Tom's Malfunctions",
                date: "12/09/16",
                time: "7:30pm",
                desc: "Go down in blades of glory, man!",
                location: "40 E Gary St., Austin, Tx 38483"
              }
            ]
          } // favCategories
        },

        111627626: {
          name: "Isaac",
          email: "m@isaac.com",
          favCategories: {
            "Talks To See": [
              {
                name: "Blades of Glory",
                date: "07/07/16",
                time: "7:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Jazz",
                date: "07/07/16",
                time: "6:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },

              {
                name: "Blades of Nast",
                date: "07/07/16",
                time: "7:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],
    
            "Art Exhibits To See": [
              {
                name: "Blades of Bitches",
                date: "07/07/16",
                time: "7:15pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Fayyyce",
                date: "07/07/16",
                time: "10:15am",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Dodge",
                date: "07/07/16",
                time: "7:25pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ],

            "Winter CO Ski Trip": [
              {
                name: "Blades of Soccer",
                date: "07/07/16",
                time: "6:45pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Golf",
                date: "07/07/16",
                time: "5:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              },
              
              {
                name: "Blades of Pinball",
                date: "07/07/16",
                time: "4:30pm",
                desc: "Go down in blades of glory, man!",
                location: "2025 E 7th St"
              }
            ]
          } // favCategories
        } // player unique id
      } // users
    }); // set function */
}); // $(document).ready() {}