/**
 * Curated sub-destination catalog for US golf travel regions.
 * Used as the primary data source when the live provider (Google Places) is
 * unavailable, so users always see location-relevant results instead of the
 * generic fallback catalog.
 */

export interface SubDestination {
  name: string;
  region: string;
  tags: string[];
  summary: string;
  driveHours: number | null;
  flightHours: number | null;
  baseNightlyRate: number;
  baseRoundCost: number;
}

const CATALOG: Record<string, SubDestination[]> = {

  // ── NORTHEAST ──────────────────────────────────────────────────────────────

  maine: [
    {
      name: "Southern Coast, Maine",
      region: "Maine",
      tags: ["coastal", "summer", "walkable links"],
      summary: "Kennebunkport and the York coast offer scenic seaside tracks with a resort-town feel — one of the East Coast's best-kept summer golf secrets.",
      driveHours: null, flightHours: 1.5, baseNightlyRate: 290, baseRoundCost: 105
    },
    {
      name: "Greater Portland, Maine",
      region: "Maine",
      tags: ["city base", "food scene", "easy logistics"],
      summary: "Portland anchors a cluster of solid public courses across Cumberland County — easy travel logistics and a great food scene for the non-golf hours.",
      driveHours: null, flightHours: 1.5, baseNightlyRate: 255, baseRoundCost: 95
    },
    {
      name: "Midcoast Maine",
      region: "Maine",
      tags: ["harbor towns", "scenic", "mixed group"],
      summary: "Camden and Rockport put you between the mountains and the sea, with classic New England courses and lobster shacks waiting after the round.",
      driveHours: null, flightHours: 1.8, baseNightlyRate: 270, baseRoundCost: 110
    },
    {
      name: "Western Maine Mountains",
      region: "Maine",
      tags: ["mountain golf", "resort", "Sunday River"],
      summary: "Bethel and the Rangeley Lakes area trade coastal charm for elevation and mountain resort energy — Sunday River's Robert Trent Jones Jr. design is a must-play.",
      driveHours: null, flightHours: 2.0, baseNightlyRate: 305, baseRoundCost: 120
    }
  ],

  "new hampshire": [
    {
      name: "Lakes Region, New Hampshire",
      region: "New Hampshire",
      tags: ["lakeside", "summer", "group house"],
      summary: "Winnipesaukee and the Lakes Region put you near a cluster of quality public courses with excellent group house options right on the water.",
      driveHours: 4.5, flightHours: 1.6, baseNightlyRate: 275, baseRoundCost: 98
    },
    {
      name: "White Mountains, New Hampshire",
      region: "New Hampshire",
      tags: ["mountain", "resort", "scenic"],
      summary: "Bretton Woods and the Mount Washington Valley deliver mountain resort golf with a strong infrastructure for larger groups.",
      driveHours: 5.5, flightHours: 1.9, baseNightlyRate: 295, baseRoundCost: 112
    },
    {
      name: "Seacoast New Hampshire",
      region: "New Hampshire",
      tags: ["coastal", "New England", "easy logistics"],
      summary: "Portsmouth anchors a compact coastal golf market — short drives, historic town feel, and easy NH vs. Maine border-hopping for the best tracks.",
      driveHours: 4.0, flightHours: 1.5, baseNightlyRate: 255, baseRoundCost: 90
    }
  ],

  vermont: [
    {
      name: "Stowe & Morrisville, Vermont",
      region: "Vermont",
      tags: ["mountain", "resort", "scenic"],
      summary: "Stowe's mountain backdrop makes for memorable round scenery, and the resort infrastructure handles groups well across a full weekend.",
      driveHours: 5.0, flightHours: 1.8, baseNightlyRate: 310, baseRoundCost: 115
    },
    {
      name: "Woodstock & Quechee, Vermont",
      region: "Vermont",
      tags: ["classic New England", "premium", "charming"],
      summary: "Some of Vermont's most polished golf tracks sit around Woodstock — classic New England without sacrificing quality.",
      driveHours: 5.5, flightHours: 1.9, baseNightlyRate: 295, baseRoundCost: 125
    },
    {
      name: "Manchester & Equinox Valley, Vermont",
      region: "Vermont",
      tags: ["historic", "walkable", "group house friendly"],
      summary: "Manchester has been a golf destination since the 19th century — classic tracks, clean mountain air, and good options for a group rental house.",
      driveHours: 5.0, flightHours: 1.7, baseNightlyRate: 280, baseRoundCost: 108
    }
  ],

  "rhode island": [
    {
      name: "Newport & Aquidneck Island, Rhode Island",
      region: "Rhode Island",
      tags: ["coastal", "history", "premium"],
      summary: "Newport's Gilded Age scenery extends to its golf — classic tracks, stunning coastline, and the best off-course dining of any New England golf trip.",
      driveHours: 4.0, flightHours: 1.4, baseNightlyRate: 310, baseRoundCost: 115
    },
    {
      name: "South County, Rhode Island",
      region: "Rhode Island",
      tags: ["coastal", "value", "beach"],
      summary: "Narragansett and the South County beaches anchor a low-key golf market — good value, less crowd friction than Newport, and easy access to the coast.",
      driveHours: 3.5, flightHours: 1.3, baseNightlyRate: 255, baseRoundCost: 90
    }
  ],

  connecticut: [
    {
      name: "Litchfield Hills, Connecticut",
      region: "Connecticut",
      tags: ["rolling hills", "classic", "driveable"],
      summary: "Northwest Connecticut's Litchfield Hills deliver classic New England parkland golf in a low-crowd, high-charm setting close to the Metro NY market.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 265, baseRoundCost: 105
    },
    {
      name: "Mystic & the Shoreline, Connecticut",
      region: "Connecticut",
      tags: ["coastal", "historic", "city access"],
      summary: "The Connecticut shoreline gives you coastal charm and a cluster of solid semi-private tracks — easy amtrak access from NYC and Boston.",
      driveHours: 3.0, flightHours: null, baseNightlyRate: 245, baseRoundCost: 95
    }
  ],

  massachusetts: [
    {
      name: "Cape Cod & the Islands, Massachusetts",
      region: "Massachusetts",
      tags: ["coastal", "summer classic", "bucket list"],
      summary: "Cape Cod's links-influenced tracks and the exclusivity of Nantucket and Martha's Vineyard make this the premier summer golf destination in the Northeast.",
      driveHours: 5.5, flightHours: 1.5, baseNightlyRate: 345, baseRoundCost: 145
    },
    {
      name: "Berkshires, Massachusetts",
      region: "Massachusetts",
      tags: ["mountain", "arts", "fall foliage"],
      summary: "The Berkshires blend culture, fall foliage, and surprisingly good golf — a strong pick when the group wants something beyond a purely golf-focused weekend.",
      driveHours: 3.5, flightHours: 1.6, baseNightlyRate: 275, baseRoundCost: 108
    },
    {
      name: "Greater Boston, Massachusetts",
      region: "Massachusetts",
      tags: ["city base", "variety", "easy flights"],
      summary: "The greater Boston area holds some of New England's best semi-private and public tracks — easy access for groups flying in from multiple cities.",
      driveHours: null, flightHours: 1.5, baseNightlyRate: 295, baseRoundCost: 118
    }
  ],

  "new york": [
    {
      name: "The Hamptons & East End, New York",
      region: "New York",
      tags: ["coastal", "premium", "summer"],
      summary: "The East End of Long Island has some of the most exclusive and beautiful golf in the country — plan well ahead and bring the right budget.",
      driveHours: 3.0, flightHours: null, baseNightlyRate: 420, baseRoundCost: 195
    },
    {
      name: "Catskills & Hudson Valley, New York",
      region: "New York",
      tags: ["mountain", "fall foliage", "driveable"],
      summary: "A 90-minute drive from NYC puts you in the Catskills' rolling fairways — underrated golf, great farm-to-table food, and strong group house options.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 260, baseRoundCost: 105
    },
    {
      name: "Finger Lakes, New York",
      region: "New York",
      tags: ["wine country", "lakes", "value"],
      summary: "The Finger Lakes region pairs solid golf with great wineries and lake lodging — a smart pick for groups that want a destination trip without a destination price tag.",
      driveHours: 5.0, flightHours: 1.8, baseNightlyRate: 240, baseRoundCost: 92
    },
    {
      name: "Adirondacks, New York",
      region: "New York",
      tags: ["mountain", "lakes", "remote"],
      summary: "Lake Placid and the Adirondacks offer mountain resort golf in one of the most dramatic natural settings in the Northeast — remote, beautiful, and worth the drive.",
      driveHours: 5.5, flightHours: 2.0, baseNightlyRate: 285, baseRoundCost: 110
    }
  ],

  "new jersey": [
    {
      name: "Jersey Shore, New Jersey",
      region: "New Jersey",
      tags: ["coastal", "summer", "driveable"],
      summary: "Spring Lake and the central Jersey Shore corridor offer classic seaside golf tracks alongside beach town lodging — a strong driveable pick for Mid-Atlantic groups.",
      driveHours: 2.0, flightHours: null, baseNightlyRate: 270, baseRoundCost: 105
    },
    {
      name: "Pine Barrens, New Jersey",
      region: "New Jersey",
      tags: ["sand belt", "classic", "affordable"],
      summary: "New Jersey's Pine Barrens is home to some of the best public and daily-fee golf on the East Coast — classic sand-belt conditions at surprisingly reasonable rates.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 215, baseRoundCost: 88
    }
  ],

  pennsylvania: [
    {
      name: "Pocono Mountains, Pennsylvania",
      region: "Pennsylvania",
      tags: ["mountain", "resort", "driveable"],
      summary: "The Poconos are the closest mountain golf destination to New York City — solid resort infrastructure and an easy drive for most Mid-Atlantic groups.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 250, baseRoundCost: 98
    },
    {
      name: "Hershey & Central Pennsylvania",
      region: "Pennsylvania",
      tags: ["classic resort", "iconic", "family-friendly"],
      summary: "Hershey Resort's Golf Collection is one of the most historic resort golf setups in the country — classic Hershey chocolate country with genuinely strong tracks.",
      driveHours: 3.5, flightHours: 1.8, baseNightlyRate: 260, baseRoundCost: 110
    },
    {
      name: "Laurel Highlands, Pennsylvania",
      region: "Pennsylvania",
      tags: ["mountain", "scenic", "Nemacolin"],
      summary: "Nemacolin and the Laurel Highlands offer some of Pennsylvania's most polished resort golf — good pick for groups that want a bigger-budget mountain experience.",
      driveHours: 5.0, flightHours: null, baseNightlyRate: 290, baseRoundCost: 125
    }
  ],

  maryland: [
    {
      name: "Eastern Shore, Maryland",
      region: "Maryland",
      tags: ["coastal", "waterfowl country", "driveable"],
      summary: "The Chesapeake's Eastern Shore pairs flat, scenic golf with great crab houses — an easy driveable trip that punches well above its drive time for Mid-Atlantic groups.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 245, baseRoundCost: 95
    },
    {
      name: "Ocean City, Maryland",
      region: "Maryland",
      tags: ["beach", "value", "summer"],
      summary: "Ocean City's boardwalk scene comes with a surprisingly deep golf market — strong value, easy logistics, and a lively off-course atmosphere.",
      driveHours: 3.0, flightHours: null, baseNightlyRate: 220, baseRoundCost: 85
    }
  ],

  // ── MID-ATLANTIC / SOUTH ───────────────────────────────────────────────────

  virginia: [
    {
      name: "Williamsburg & the Virginia Peninsula",
      region: "Virginia",
      tags: ["classic golf", "history", "resort"],
      summary: "Williamsburg is one of the original golf trip destinations on the East Coast — quality tracks, strong resort infrastructure, and easy air access.",
      driveHours: null, flightHours: 2.2, baseNightlyRate: 265, baseRoundCost: 128
    },
    {
      name: "Shenandoah Valley, Virginia",
      region: "Virginia",
      tags: ["mountain", "scenic", "driveable"],
      summary: "The Shenandoah puts you in the middle of stunning ridge-and-valley scenery with solid public golf and reasonable rates for the overall quality.",
      driveHours: 5.0, flightHours: null, baseNightlyRate: 240, baseRoundCost: 95
    },
    {
      name: "Virginia Beach & Hampton Roads",
      region: "Virginia",
      tags: ["coastal", "beach", "group-friendly"],
      summary: "Virginia Beach gives you waterfront lodging, a lively off-course scene, and enough quality tracks within 45 minutes to fill a long weekend.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 260, baseRoundCost: 105
    },
    {
      name: "Homestead & Hot Springs, Virginia",
      region: "Virginia",
      tags: ["resort", "historic", "mountain"],
      summary: "The Homestead Resort is one of the oldest golf destinations in America — a bucket-list mountain resort experience for the group that wants history and quality.",
      driveHours: 5.5, flightHours: null, baseNightlyRate: 335, baseRoundCost: 145
    }
  ],

  "west virginia": [
    {
      name: "Greenbrier & White Sulphur Springs, West Virginia",
      region: "West Virginia",
      tags: ["bucket list", "historic resort", "premium"],
      summary: "The Greenbrier is one of the great American resort golf experiences — President's Course, Old White, and Meadows in a dramatic mountain setting.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 380, baseRoundCost: 175
    },
    {
      name: "Eastern Panhandle, West Virginia",
      region: "West Virginia",
      tags: ["mountain", "driveable", "value"],
      summary: "The Eastern Panhandle is within easy striking distance of DC and Baltimore — solid golf options at mountain rates without the resort price tag.",
      driveHours: 2.5, flightHours: null, baseNightlyRate: 225, baseRoundCost: 88
    }
  ],

  // ── SOUTHEAST ─────────────────────────────────────────────────────────────

  "north carolina": [
    {
      name: "Pinehurst & the Sandhills",
      region: "North Carolina",
      tags: ["classic golf", "bucket list", "easy weekend"],
      summary: "The Sandhills is the most storied golf destination on the East Coast — sand-belt courses, a classic resort town, and a strong group trip infrastructure.",
      driveHours: null, flightHours: 2.2, baseNightlyRate: 285, baseRoundCost: 165
    },
    {
      name: "Myrtle Beach Border Area, NC",
      region: "North Carolina",
      tags: ["value", "high volume", "budget-friendly"],
      summary: "The Brunswick County courses just north of the SC border give you Myrtle Beach-caliber options at lower rates and with less crowd friction.",
      driveHours: null, flightHours: 2.0, baseNightlyRate: 215, baseRoundCost: 88
    },
    {
      name: "Asheville & Blue Ridge Mountains",
      region: "North Carolina",
      tags: ["mountain", "cool summer", "food scene"],
      summary: "Asheville combines mountain resort golf with one of the best small-city food scenes in the Southeast — a strong pick for mixed groups.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 260, baseRoundCost: 110
    },
    {
      name: "High Country & Blowing Rock, NC",
      region: "North Carolina",
      tags: ["elevation", "cool summer", "scenic"],
      summary: "The High Country's elevation keeps summer temps in the 70s while the rest of the Southeast bakes — spectacular mountain views and genuine golf.",
      driveHours: 5.5, flightHours: 2.8, baseNightlyRate: 250, baseRoundCost: 105
    }
  ],

  "south carolina": [
    {
      name: "Hilton Head & the Lowcountry",
      region: "South Carolina",
      tags: ["resort", "island", "premium"],
      summary: "Hilton Head's plantation courses and ocean backdrop make it a top-tier destination — stronger on polish and prestige than any other East Coast pick.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 320, baseRoundCost: 155
    },
    {
      name: "Myrtle Beach Grand Strand",
      region: "South Carolina",
      tags: ["high volume", "value", "golf first"],
      summary: "Myrtle Beach packs more playable courses into a small footprint than anywhere in the country — best for groups that want to maximize rounds at reasonable rates.",
      driveHours: null, flightHours: 2.3, baseNightlyRate: 210, baseRoundCost: 85
    },
    {
      name: "Kiawah Island & Charleston Area",
      region: "South Carolina",
      tags: ["coastal", "premium", "bucket list"],
      summary: "Kiawah's Ocean Course is the biggest bucket-list round in the Southeast — Charleston provides the best off-course scene if the group wants to explore.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 375, baseRoundCost: 195
    },
    {
      name: "Pawleys Island & Georgetown, SC",
      region: "South Carolina",
      tags: ["coastal", "value", "laid-back"],
      summary: "Pawleys Island splits the difference between Hilton Head luxury and Myrtle Beach volume — great course quality at a laid-back coastal pace.",
      driveHours: null, flightHours: 2.3, baseNightlyRate: 245, baseRoundCost: 95
    }
  ],

  georgia: [
    {
      name: "Golden Isles & Sea Island, Georgia",
      region: "Georgia",
      tags: ["coastal", "resort", "premium"],
      summary: "Sea Island and Jekyll Island deliver a premium coastal resort experience — polished tracks, ocean views, and strong infrastructure for a destination trip.",
      driveHours: null, flightHours: 2.0, baseNightlyRate: 340, baseRoundCost: 165
    },
    {
      name: "Savannah & Coastal Georgia",
      region: "Georgia",
      tags: ["city base", "scenic", "history"],
      summary: "Savannah is one of the best mid-size cities for a golf trip base — great food scene, strong lodging options, and quality courses within easy reach.",
      driveHours: null, flightHours: 2.3, baseNightlyRate: 255, baseRoundCost: 120
    },
    {
      name: "North Georgia Mountains",
      region: "Georgia",
      tags: ["mountain", "driveable", "fall foliage"],
      summary: "The Blue Ridge foothills north of Atlanta put you near elevated mountain courses with group house options and a driveable setup for most of the Southeast.",
      driveHours: 4.0, flightHours: null, baseNightlyRate: 235, baseRoundCost: 95
    },
    {
      name: "Reynolds Lake Oconee, Georgia",
      region: "Georgia",
      tags: ["lake resort", "premium", "golf community"],
      summary: "Reynolds Lake Oconee is one of the Southeast's premier golf resort communities — six championship courses in a single lakeside destination.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 310, baseRoundCost: 145
    }
  ],

  florida: [
    {
      name: "Naples & Fort Myers, Florida",
      region: "Florida",
      tags: ["Gulf Coast", "resort", "winter escape"],
      summary: "Southwest Florida's Gulf Coast gives you premium resort golf and the best weather of any destination in January through March.",
      driveHours: null, flightHours: 3.2, baseNightlyRate: 340, baseRoundCost: 175
    },
    {
      name: "Amelia Island & Jacksonville, Florida",
      region: "Florida",
      tags: ["coastal", "resort", "underrated"],
      summary: "Amelia Island's iconic resort courses and Jacksonville's breadth of public tracks make northeast Florida one of the most underrated golf trip destinations.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 295, baseRoundCost: 135
    },
    {
      name: "Orlando Golf Coast, Florida",
      region: "Florida",
      tags: ["value", "variety", "easy flights"],
      summary: "Orlando's golf infrastructure is massive — great price-to-quality, easy flight access for groups from multiple cities, and tons of lodging options.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 240, baseRoundCost: 110
    },
    {
      name: "Florida Panhandle & Destin",
      region: "Florida",
      tags: ["beach", "emerald coast", "group-friendly"],
      summary: "The Emerald Coast delivers stunning white sand beaches alongside strong golf tracks — the best pick when the group wants golf AND beach.",
      driveHours: 8.0, flightHours: 2.5, baseNightlyRate: 280, baseRoundCost: 115
    },
    {
      name: "Palm Beach & the Treasure Coast",
      region: "Florida",
      tags: ["upscale", "winter", "Palm Beach"],
      summary: "Palm Beach County's golf market is deep and well-maintained — strong resort and private-access options for groups willing to invest in a polished South Florida trip.",
      driveHours: null, flightHours: 3.3, baseNightlyRate: 320, baseRoundCost: 155
    }
  ],

  alabama: [
    {
      name: "Robert Trent Jones Golf Trail",
      region: "Alabama",
      tags: ["bucket list", "value", "golf trail"],
      summary: "Alabama's RTJ Golf Trail is one of the great American golf value stories — 26 courses across 11 sites built by Robert Trent Jones Sr. at state park prices.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 195, baseRoundCost: 65
    },
    {
      name: "Gulf Shores & Orange Beach, Alabama",
      region: "Alabama",
      tags: ["beach", "Gulf Coast", "value"],
      summary: "Alabama's Gulf Coast gives you white sand beaches, strong public golf, and some of the best value for a Gulf Coast trip outside of Florida.",
      driveHours: null, flightHours: 3.2, baseNightlyRate: 215, baseRoundCost: 80
    }
  ],

  mississippi: [
    {
      name: "Natchez Trace Golf, Mississippi",
      region: "Mississippi",
      tags: ["history", "value", "driveable south"],
      summary: "Mississippi's golf market is small but underpriced — the Natchez corridor pairs historic plantation scenery with genuinely cheap and accessible daily-fee golf.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 175, baseRoundCost: 60
    }
  ],

  louisiana: [
    {
      name: "New Orleans & the Gulf Coast, Louisiana",
      region: "Louisiana",
      tags: ["city golf", "culture", "unique"],
      summary: "New Orleans is one of the most unique golf trip bases in the country — solid semi-private courses within reach and an unmatched off-course scene.",
      driveHours: null, flightHours: 3.2, baseNightlyRate: 255, baseRoundCost: 90
    }
  ],

  tennessee: [
    {
      name: "Nashville & Middle Tennessee",
      region: "Tennessee",
      tags: ["city golf", "Music City", "group-friendly"],
      summary: "Nashville has quietly become one of the best golf trip cities in the country — great courses, legendary bachelor party infrastructure, and strong food and entertainment.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 265, baseRoundCost: 105
    },
    {
      name: "Smoky Mountains & Gatlinburg, Tennessee",
      region: "Tennessee",
      tags: ["mountain", "resort", "scenic"],
      summary: "The Smokies pack mountain resort golf alongside one of the most popular vacation corridors in the Southeast — good for groups mixing golfers and non-golfers.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 245, baseRoundCost: 95
    }
  ],

  kentucky: [
    {
      name: "Lexington & Bluegrass Country, Kentucky",
      region: "Kentucky",
      tags: ["horse country", "classic", "driveable"],
      summary: "The Bluegrass Region's rolling horse farm scenery extends to its golf courses — a distinctive backdrop for a trip that's authentically different from the usual destinations.",
      driveHours: 5.5, flightHours: 2.5, baseNightlyRate: 235, baseRoundCost: 92
    },
    {
      name: "Louisville, Kentucky",
      region: "Kentucky",
      tags: ["city golf", "bourbon trail", "driveable"],
      summary: "Louisville's urban golf scene pairs with the Bourbon Trail to create a golf trip where the 19th hole is as good as the round — Valhalla's backyard.",
      driveHours: 5.0, flightHours: 2.5, baseNightlyRate: 225, baseRoundCost: 88
    }
  ],

  // ── MIDWEST ────────────────────────────────────────────────────────────────

  michigan: [
    {
      name: "Traverse City & Northern Michigan",
      region: "Michigan",
      tags: ["dunes", "destination", "summer peak"],
      summary: "Traverse City and the tip of the mitt is Michigan's premier golf corridor — Sleeping Bear country, honest dunes golf, and a strong group house market.",
      driveHours: 5.0, flightHours: 1.5, baseNightlyRate: 265, baseRoundCost: 125
    },
    {
      name: "Petoskey & Harbor Springs, Michigan",
      region: "Michigan",
      tags: ["resort", "premium", "lakeside"],
      summary: "The Petoskey area packs some of Michigan's best conditioned tracks into a short drive of Little Traverse Bay — great for a group wanting premium Northern Michigan.",
      driveHours: 5.5, flightHours: 1.6, baseNightlyRate: 290, baseRoundCost: 142
    },
    {
      name: "Gaylord & the Inland Waterway, Michigan",
      region: "Michigan",
      tags: ["golf first", "value", "high density"],
      summary: "Gaylord calls itself the 'Golf Mecca of the Midwest' and backs it up with more quality public courses per square mile than almost anywhere.",
      driveHours: 5.0, flightHours: 1.5, baseNightlyRate: 240, baseRoundCost: 105
    },
    {
      name: "Mackinac Island & the Upper Peninsula",
      region: "Michigan",
      tags: ["bucket list", "ferry required", "unique"],
      summary: "Getting to Mackinac is part of the trip — the car-free island and UP's wild Upper Michigan courses are a bucket-list experience for the right group.",
      driveHours: 6.0, flightHours: 1.8, baseNightlyRate: 310, baseRoundCost: 130
    }
  ],

  wisconsin: [
    {
      name: "Kohler & Sheboygan, Wisconsin",
      region: "Wisconsin",
      tags: ["destination", "Whistling Straits", "premium"],
      summary: "Kohler's Destination Kohler complex anchors one of the Midwest's strongest destination golf setups — Whistling Straits, Blackwolf Run, and full resort service.",
      driveHours: 5.5, flightHours: 1.4, baseNightlyRate: 345, baseRoundCost: 175
    },
    {
      name: "Door County, Wisconsin",
      region: "Wisconsin",
      tags: ["peninsula", "summer", "scenic"],
      summary: "Door County's long summer days, lakeside lodging, and collection of solid tracks make it one of the Midwest's most underrated golf trip destinations.",
      driveHours: 6.0, flightHours: 1.5, baseNightlyRate: 270, baseRoundCost: 115
    },
    {
      name: "Lake Country & Pewaukee, Wisconsin",
      region: "Wisconsin",
      tags: ["driveable", "lake region", "group house"],
      summary: "The Lake Country corridor west of Milwaukee gives you a high density of solid courses with easy driving logistics and a strong group house market.",
      driveHours: 4.5, flightHours: 1.2, baseNightlyRate: 240, baseRoundCost: 98
    }
  ],

  minnesota: [
    {
      name: "Brainerd Lakes Area, Minnesota",
      region: "Minnesota",
      tags: ["lakes", "resort", "summer"],
      summary: "Brainerd anchors the Twin Cities golf trip scene — Cragun's, Grand View, and Madden's pack more resort courses into one area than anywhere else in the upper Midwest.",
      driveHours: 3.5, flightHours: null, baseNightlyRate: 265, baseRoundCost: 105
    },
    {
      name: "Alexandria Lakes, Minnesota",
      region: "Minnesota",
      tags: ["lakes", "value", "driveable"],
      summary: "Alexandria is a slightly more budget-friendly alternative to Brainerd with great lake country lodging and a strong cluster of public courses.",
      driveHours: 3.0, flightHours: null, baseNightlyRate: 235, baseRoundCost: 88
    },
    {
      name: "Duluth & the North Shore, Minnesota",
      region: "Minnesota",
      tags: ["scenic", "Lake Superior", "unique"],
      summary: "Golf along the Lake Superior North Shore is dramatic and underplayed — high bluff courses with incredible views and a wild, remote feel.",
      driveHours: 4.0, flightHours: 1.5, baseNightlyRate: 240, baseRoundCost: 92
    }
  ],

  iowa: [
    {
      name: "Des Moines & Central Iowa",
      region: "Iowa",
      tags: ["value", "city golf", "driveable"],
      summary: "Iowa punches well above its reputation for golf — Des Moines and the surrounding counties hold some surprisingly well-maintained public tracks at excellent value.",
      driveHours: 5.0, flightHours: 2.5, baseNightlyRate: 185, baseRoundCost: 70
    }
  ],

  illinois: [
    {
      name: "Galena & Northwest Illinois",
      region: "Illinois",
      tags: ["resort", "Eagle Ridge", "driveable"],
      summary: "Eagle Ridge Resort in Galena is one of the great Midwest golf resort destinations — four quality courses tucked into rolling northwest Illinois hill country.",
      driveHours: 4.0, flightHours: null, baseNightlyRate: 255, baseRoundCost: 105
    },
    {
      name: "Moline & the Quad Cities, Illinois",
      region: "Illinois",
      tags: ["river corridor", "value", "driveable"],
      summary: "The Quad Cities corridor on the Mississippi River gives you solid public golf at hard-to-beat Midwest value — a practical pick for a lower-budget trip.",
      driveHours: 4.5, flightHours: 2.0, baseNightlyRate: 195, baseRoundCost: 75
    }
  ],

  indiana: [
    {
      name: "French Lick & Southern Indiana",
      region: "Indiana",
      tags: ["resort", "historic", "Pete Dye"],
      summary: "French Lick Resort is one of Indiana's hidden gems — Pete Dye course, Donald Ross original, and a full resort setup in the wooded hills of southern Indiana.",
      driveHours: 5.0, flightHours: 2.5, baseNightlyRate: 245, baseRoundCost: 115
    }
  ],

  ohio: [
    {
      name: "Columbus & Central Ohio",
      region: "Ohio",
      tags: ["city golf", "Muirfield Village", "accessible"],
      summary: "Central Ohio has one of the most underrated urban golf markets in the Midwest — Muirfield Village's backyard and a deep public course inventory.",
      driveHours: null, flightHours: 2.0, baseNightlyRate: 220, baseRoundCost: 88
    },
    {
      name: "Cleveland & Northeast Ohio",
      region: "Ohio",
      tags: ["classic courses", "value", "driveable"],
      summary: "Northeast Ohio's classic parkland courses and surprisingly affordable rates make it a strong pick for groups willing to look past the big-name destinations.",
      driveHours: null, flightHours: 2.2, baseNightlyRate: 215, baseRoundCost: 82
    }
  ],

  missouri: [
    {
      name: "Branson & the Ozarks, Missouri",
      region: "Missouri",
      tags: ["resort", "lake", "scenic"],
      summary: "The Ozarks around Branson and Lake of the Ozarks give you resort golf, lakeside lodging, and entertainment options that keep non-golfers happy too.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 220, baseRoundCost: 85
    },
    {
      name: "Kansas City, Missouri",
      region: "Missouri",
      tags: ["city golf", "BBQ", "driveable"],
      summary: "Kansas City has a quietly deep public and semi-private golf market — pair it with the city's legendary BBQ scene for a trip that's about more than the golf.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 215, baseRoundCost: 82
    }
  ],

  kansas: [
    {
      name: "Wichita & South-Central Kansas",
      region: "Kansas",
      tags: ["value", "city golf", "central"],
      summary: "Wichita's golf scene is compact but punches above expectations — good public tracks, excellent value, and easy driving logistics for a Midwest weekend.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 185, baseRoundCost: 68
    }
  ],

  nebraska: [
    {
      name: "Sand Hills & the Sandhills Region, Nebraska",
      region: "Nebraska",
      tags: ["bucket list", "links", "remote"],
      summary: "Nebraska's Sandhills is one of the great American golf pilgrimages — Sand Hills Golf Club and Dismal River are genuine world-class tracks in an impossibly remote setting.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 280, baseRoundCost: 185
    },
    {
      name: "Omaha & Eastern Nebraska",
      region: "Nebraska",
      tags: ["city golf", "value", "accessible"],
      summary: "Omaha holds some of the best urban golf value in the Great Plains — solid public and semi-private tracks without the pricing of larger metro markets.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 190, baseRoundCost: 72
    }
  ],

  "north dakota": [
    {
      name: "Fargo & the Red River Valley",
      region: "North Dakota",
      tags: ["value", "flat terrain", "driveable plains"],
      summary: "Fargo's golf market is flat, fast, and affordable — good public tracks for a group that wants a relaxed, low-cost plains golf trip.",
      driveHours: null, flightHours: 3.2, baseNightlyRate: 165, baseRoundCost: 55
    }
  ],

  "south dakota": [
    {
      name: "Black Hills & Rapid City, South Dakota",
      region: "South Dakota",
      tags: ["mountain", "scenic", "Mount Rushmore"],
      summary: "The Black Hills give you dramatic western scenery with a solid golf market — combine Rapid City's courses with a Custer State Park round for a unique Midwest golf trip.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 215, baseRoundCost: 85
    }
  ],

  // ── SOUTHWEST ──────────────────────────────────────────────────────────────

  arizona: [
    {
      name: "Scottsdale & North Phoenix, Arizona",
      region: "Arizona",
      tags: ["sun", "premium", "resort"],
      summary: "Scottsdale's resort corridor is the gold standard for sun-guaranteed destination golf — best weather October through April, and polished tracks.",
      driveHours: null, flightHours: 4.0, baseNightlyRate: 395, baseRoundCost: 225
    },
    {
      name: "Tucson & the Sonoran Desert, Arizona",
      region: "Arizona",
      tags: ["desert", "value", "mountain views"],
      summary: "Tucson delivers genuine Arizona desert golf energy at 15–25% lower rates than Scottsdale — better value, same sun, mountain views.",
      driveHours: null, flightHours: 4.2, baseNightlyRate: 295, baseRoundCost: 155
    },
    {
      name: "Sedona & the Verde Valley, Arizona",
      region: "Arizona",
      tags: ["red rocks", "scenic", "unique"],
      summary: "Sedona's red rock backdrop makes for one of the most visually dramatic golf settings anywhere — fewer courses, but the ones here are genuinely memorable.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 340, baseRoundCost: 175
    },
    {
      name: "White Mountains, Arizona",
      region: "Arizona",
      tags: ["mountain", "cool summer", "elevation"],
      summary: "Arizona's White Mountains are the state's best-kept summer golf secret — pine forests, elevation cool-down, and dramatic terrain far from the Phoenix heat.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 220, baseRoundCost: 95
    }
  ],

  "new mexico": [
    {
      name: "Santa Fe & Albuquerque, New Mexico",
      region: "New Mexico",
      tags: ["elevation", "high desert", "unique"],
      summary: "Santa Fe and Albuquerque sit at 7,000 feet — the thin air adds 15–20 yards to every shot and the high desert scenery makes for genuinely memorable rounds.",
      driveHours: null, flightHours: 3.8, baseNightlyRate: 245, baseRoundCost: 98
    },
    {
      name: "Ruidoso & the Lincoln National Forest, NM",
      region: "New Mexico",
      tags: ["mountain", "cool summer", "hidden gem"],
      summary: "Ruidoso is New Mexico's mountain resort town — pine-lined fairways, cooler temperatures, and a laid-back pace that's great for a more relaxed group trip.",
      driveHours: null, flightHours: 4.0, baseNightlyRate: 215, baseRoundCost: 85
    }
  ],

  texas: [
    {
      name: "Texas Hill Country & San Antonio",
      region: "Texas",
      tags: ["hill country", "resort", "scenic"],
      summary: "The Texas Hill Country delivers genuine destination golf energy — live oaks, cedar, and limestone canyons make for visually striking tracks.",
      driveHours: null, flightHours: 3.8, baseNightlyRate: 275, baseRoundCost: 130
    },
    {
      name: "Houston & Galveston Bay, Texas",
      region: "Texas",
      tags: ["coastal", "variety", "city base"],
      summary: "The greater Houston area packs an enormous variety of golf at every price point — good for groups flying in from multiple cities.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 230, baseRoundCost: 95
    },
    {
      name: "Dallas–Fort Worth Metroplex, Texas",
      region: "Texas",
      tags: ["city golf", "driveable", "value"],
      summary: "DFW's sprawl comes with a big upside for golf — a density of solid courses and a range of budget options across the metroplex.",
      driveHours: null, flightHours: 3.2, baseNightlyRate: 245, baseRoundCost: 105
    },
    {
      name: "South Padre Island & the Valley, Texas",
      region: "Texas",
      tags: ["beach", "winter escape", "Gulf Coast"],
      summary: "South Texas's golf market is underplayed — great winter rates, flat fast courses, and a beach scene that makes the off-course hours easy.",
      driveHours: null, flightHours: 3.8, baseNightlyRate: 195, baseRoundCost: 78
    }
  ],

  oklahoma: [
    {
      name: "Tulsa & Green Country, Oklahoma",
      region: "Oklahoma",
      tags: ["classic courses", "Southern Hills", "value"],
      summary: "Tulsa's golf credentials are underrated — Southern Hills' backyard and a roster of quality private and public tracks at honest Oklahoma prices.",
      driveHours: null, flightHours: 2.8, baseNightlyRate: 195, baseRoundCost: 78
    }
  ],

  arkansas: [
    {
      name: "Ozark Mountains & Fayetteville, Arkansas",
      region: "Arkansas",
      tags: ["mountain", "value", "scenic"],
      summary: "The Arkansas Ozarks are a genuine hidden gem for golf — spectacular mountain and river valley terrain, strong course quality, and some of the best value in the South.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 195, baseRoundCost: 72
    }
  ],

  // ── MOUNTAIN WEST ──────────────────────────────────────────────────────────

  colorado: [
    {
      name: "Vail Valley & Eagle River, Colorado",
      region: "Colorado",
      tags: ["mountain", "elevation", "premium"],
      summary: "Mountain golf at 8,000 feet with dramatic scenery and resort infrastructure built around the Vail name — a bucket-list mountain experience.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 420, baseRoundCost: 195
    },
    {
      name: "Colorado Springs & Pikes Peak, Colorado",
      region: "Colorado",
      tags: ["elevation", "value", "front range"],
      summary: "Colorado Springs punches above its weight class for golf — solid tracks in the shadow of Pikes Peak at meaningfully lower prices than the ski resort towns.",
      driveHours: null, flightHours: 4.0, baseNightlyRate: 260, baseRoundCost: 120
    },
    {
      name: "Steamboat Springs, Colorado",
      region: "Colorado",
      tags: ["mountain", "laid-back", "scenic"],
      summary: "Steamboat gives you the mountain resort vibe without the Vail price tag — great for a group wanting Colorado elevation without the top-end budget.",
      driveHours: null, flightHours: 4.8, baseNightlyRate: 310, baseRoundCost: 145
    },
    {
      name: "Telluride & Southwest Colorado",
      region: "Colorado",
      tags: ["remote", "bucket list", "jaw-dropping scenery"],
      summary: "Telluride's golf market is small but the mountain scenery is the most dramatic in Colorado — a true bucket-list trip for the group that wants something completely unique.",
      driveHours: null, flightHours: 5.0, baseNightlyRate: 385, baseRoundCost: 175
    }
  ],

  utah: [
    {
      name: "St. George & Southern Utah",
      region: "Utah",
      tags: ["red rocks", "desert", "winter golf"],
      summary: "St. George is the Southwest's best-kept golf value secret — red rock canyon scenery on par with Sedona, strong course quality, and significantly lower rates.",
      driveHours: null, flightHours: 3.8, baseNightlyRate: 240, baseRoundCost: 105
    },
    {
      name: "Park City & the Wasatch Back, Utah",
      region: "Utah",
      tags: ["mountain", "resort", "summer elevation"],
      summary: "Park City's elevation keeps summer temperatures perfect for golf while the resort infrastructure handles groups seamlessly — and Salt Lake City flights are easy.",
      driveHours: null, flightHours: 3.8, baseNightlyRate: 310, baseRoundCost: 145
    }
  ],

  nevada: [
    {
      name: "Las Vegas, Nevada",
      region: "Nevada",
      tags: ["desert", "entertainment", "group-friendly"],
      summary: "Las Vegas has a massive golf market alongside its obvious off-course draw — resort courses, strong group infrastructure, and easy flights from anywhere in the country.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 290, baseRoundCost: 145
    },
    {
      name: "Reno & Lake Tahoe, Nevada",
      region: "Nevada",
      tags: ["mountain", "lake", "summer"],
      summary: "Tahoe-area golf in summer is spectacular — mountain elevation, lake views, and a casino scene that makes the 19th hole entertaining for everyone.",
      driveHours: null, flightHours: 4.8, baseNightlyRate: 295, baseRoundCost: 135
    }
  ],

  idaho: [
    {
      name: "Sun Valley & the Wood River Valley, Idaho",
      region: "Idaho",
      tags: ["resort", "mountain", "premium"],
      summary: "Sun Valley's summer golf scene is an underrated gem — the same resort infrastructure that handles world-class skiing pivots gracefully to mountain golf.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 310, baseRoundCost: 140
    },
    {
      name: "Coeur d'Alene, Idaho",
      region: "Idaho",
      tags: ["lake", "resort", "scenic"],
      summary: "Coeur d'Alene Resort's floating island green is one of the most photographed holes in golf — the full course and lake resort experience make for a memorable group trip.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 280, baseRoundCost: 125
    }
  ],

  montana: [
    {
      name: "Whitefish & Glacier Country, Montana",
      region: "Montana",
      tags: ["mountain", "remote", "scenic"],
      summary: "Big Sky country golf near Glacier National Park is as dramatic as any setting in North America — remote, uncrowded, and genuinely breathtaking.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 265, baseRoundCost: 110
    },
    {
      name: "Billings & Yellowstone Country, Montana",
      region: "Montana",
      tags: ["western", "scenic", "accessible"],
      summary: "Eastern Montana's golf market is small but the combination of big sky scenery and Yellowstone proximity makes for a trip that's about more than the golf.",
      driveHours: null, flightHours: 4.0, baseNightlyRate: 220, baseRoundCost: 85
    }
  ],

  wyoming: [
    {
      name: "Jackson Hole & Grand Teton, Wyoming",
      region: "Wyoming",
      tags: ["mountain", "bucket list", "scenic"],
      summary: "Teeing off with the Tetons as a backdrop is one of golf's great settings — Jackson Hole's resort golf is pricey but the scenery alone justifies the trip.",
      driveHours: null, flightHours: 4.5, baseNightlyRate: 350, baseRoundCost: 155
    }
  ],

  // ── PACIFIC WEST ───────────────────────────────────────────────────────────

  california: [
    {
      name: "Monterey Peninsula & Carmel, California",
      region: "California",
      tags: ["bucket list", "coastal", "Pebble Beach"],
      summary: "Pebble Beach and the Monterey Peninsula form the most iconic golf destination in the country — reserve well in advance and bring a bigger budget.",
      driveHours: null, flightHours: 5.5, baseNightlyRate: 495, baseRoundCost: 280
    },
    {
      name: "Palm Springs & the Desert, California",
      region: "California",
      tags: ["desert", "sun", "resort"],
      summary: "Palm Springs and the Coachella Valley are Scottsdale's West Coast counterpart — 100+ courses, guaranteed winter sun, and a strong resort infrastructure.",
      driveHours: null, flightHours: 5.8, baseNightlyRate: 355, baseRoundCost: 185
    },
    {
      name: "Sonoma & Wine Country, California",
      region: "California",
      tags: ["wine country", "scenic", "premium"],
      summary: "Wine Country golf is less well-known than it deserves — a handful of strong semi-private tracks surrounded by vineyards and world-class dining after the round.",
      driveHours: null, flightHours: 5.5, baseNightlyRate: 385, baseRoundCost: 165
    },
    {
      name: "San Diego & the Coast, California",
      region: "California",
      tags: ["coastal", "perfect weather", "torrey pines"],
      summary: "San Diego has the best year-round golf weather in the mainland US — Torrey Pines, Aviara, and a deep coastal market make it a consistently strong pick.",
      driveHours: null, flightHours: 5.8, baseNightlyRate: 345, baseRoundCost: 165
    }
  ],

  oregon: [
    {
      name: "Bandon & the Oregon Coast",
      region: "Oregon",
      tags: ["bucket list", "links", "remote"],
      summary: "Bandon Dunes is the closest thing to true links golf on American soil — a bucket-list destination that fully delivers on the promise.",
      driveHours: null, flightHours: 6.0, baseNightlyRate: 440, baseRoundCost: 265
    },
    {
      name: "Portland & the Columbia River Gorge, Oregon",
      region: "Oregon",
      tags: ["Pacific NW", "scenic", "city base"],
      summary: "Portland anchors a surprisingly strong golf scene — a mix of parkland and links-style tracks in one of the most liveable cities in the Northwest.",
      driveHours: null, flightHours: 5.8, baseNightlyRate: 255, baseRoundCost: 105
    },
    {
      name: "Bend & Central Oregon",
      region: "Oregon",
      tags: ["high desert", "mountain", "outdoor"],
      summary: "Bend's high desert plateau delivers sunshine, dramatic volcanic scenery, and a growing roster of quality courses — one of the Pacific NW's most underrated golf cities.",
      driveHours: null, flightHours: 5.8, baseNightlyRate: 265, baseRoundCost: 110
    }
  ],

  washington: [
    {
      name: "Seattle & the Puget Sound, Washington",
      region: "Washington",
      tags: ["Pacific NW", "city golf", "scenic"],
      summary: "Greater Seattle holds a deep and varied golf market — the dry-season summers (June–September) make it a genuinely excellent golf destination on the right dates.",
      driveHours: null, flightHours: 5.8, baseNightlyRate: 270, baseRoundCost: 108
    },
    {
      name: "Tri-Cities & Columbia Basin, Washington",
      region: "Washington",
      tags: ["sun", "value", "eastern WA"],
      summary: "Eastern Washington's Columbia Basin is the state's sun belt — 300 days of sun, strong course quality, and value pricing that the Seattle side can't match.",
      driveHours: null, flightHours: 5.5, baseNightlyRate: 215, baseRoundCost: 85
    },
    {
      name: "Spokane & the Inland Empire, Washington",
      region: "Washington",
      tags: ["value", "city golf", "accessible"],
      summary: "Spokane has a surprisingly deep public golf market with some of the best conditions per dollar in the Pacific Northwest.",
      driveHours: null, flightHours: 5.5, baseNightlyRate: 210, baseRoundCost: 80
    }
  ],

  hawaii: [
    {
      name: "Maui, Hawaii",
      region: "Hawaii",
      tags: ["bucket list", "tropical", "resort"],
      summary: "Maui's Kapalua, Wailea, and Makena tracks are some of the most visually spectacular in the world — ocean views, trade winds, and pure bucket-list energy.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 475, baseRoundCost: 245
    },
    {
      name: "Big Island, Hawaii",
      region: "Hawaii",
      tags: ["bucket list", "volcanic", "resort"],
      summary: "The Big Island's lava-field courses (Mauna Kea, Hualalai, Waikoloa) are unlike anything else in golf — otherworldly terrain with Pacific Ocean backdrops.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 445, baseRoundCost: 235
    },
    {
      name: "Oahu, Hawaii",
      region: "Hawaii",
      tags: ["accessible", "diverse", "Honolulu"],
      summary: "Oahu gives you the easiest Hawaii logistics — Ko Olina and Turtle Bay on the same island as Honolulu's food scene and city energy.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 380, baseRoundCost: 185
    },
    {
      name: "Kauai, Hawaii",
      region: "Hawaii",
      tags: ["remote", "lush", "scenic"],
      summary: "Kauai's Princeville and Poipu courses sit inside the island's dramatic green cliffs and ocean valleys — the most visually lush golf in Hawaii.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 390, baseRoundCost: 195
    }
  ],

  alaska: [
    {
      name: "Anchorage & the Kenai Peninsula, Alaska",
      region: "Alaska",
      tags: ["midnight sun", "unique", "bucket list"],
      summary: "Alaska summer golf under the midnight sun is a genuine bucket-list experience — Anchorage has real courses and the Kenai Peninsula's scenery is incomparable.",
      driveHours: null, flightHours: 7.5, baseNightlyRate: 295, baseRoundCost: 115
    }
  ],

  // ── CANADA (common cross-border requests) ──────────────────────────────────

  canada: [
    {
      name: "Banff & Jasper, Alberta",
      region: "Alberta, Canada",
      tags: ["bucket list", "mountain", "Fairmont"],
      summary: "The Banff Springs and Jasper Park Lodge courses are two of the most photographed in the world — a genuine bucket-list experience with Fairmont resort service.",
      driveHours: null, flightHours: 5.5, baseNightlyRate: 390, baseRoundCost: 185
    },
    {
      name: "Muskoka & Georgian Bay, Ontario",
      region: "Ontario, Canada",
      tags: ["lake district", "resort", "summer"],
      summary: "Muskoka's cottage country resort golf is one of Canada's great summer trip destinations — dramatic lake scenery, strong course quality, and easy Toronto access.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 310, baseRoundCost: 135
    },
    {
      name: "Prince Edward Island, Canada",
      region: "PEI, Canada",
      tags: ["links", "coastal", "unique"],
      summary: "PEI is Canada's golf gem — red sand beaches, true links-influenced courses, and a relaxed Maritime pace that makes it perfect for a group that loves discovering something different.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 255, baseRoundCost: 95
    }
  ],

  // ── COMMON NAMED REGIONS ───────────────────────────────────────────────────

  "blue ridge": [
    {
      name: "Asheville & Blue Ridge Parkway, NC",
      region: "North Carolina",
      tags: ["mountain", "scenic", "cool summers"],
      summary: "Asheville delivers mountain resort golf with one of the best food scenes in the Southeast.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 265, baseRoundCost: 112
    },
    {
      name: "Blowing Rock & High Country, NC",
      region: "North Carolina",
      tags: ["elevation", "cool summer", "scenic"],
      summary: "The High Country's elevation keeps summer temperatures in the 70s while the rest of the Southeast bakes.",
      driveHours: 5.5, flightHours: 2.8, baseNightlyRate: 250, baseRoundCost: 105
    },
    {
      name: "Roanoke & the Allegheny Highlands, VA",
      region: "Virginia",
      tags: ["mountain", "value", "driveable"],
      summary: "Western Virginia is an underrated mountain golf corridor — solid course quality at value prices, with the Blue Ridge Mountains as a constant backdrop.",
      driveHours: 5.0, flightHours: null, baseNightlyRate: 230, baseRoundCost: 88
    },
    {
      name: "Shenandoah Valley, Virginia",
      region: "Virginia",
      tags: ["mountain", "scenic", "driveable"],
      summary: "The Shenandoah puts you in the middle of stunning ridge-and-valley scenery with solid public golf and reasonable rates.",
      driveHours: 5.0, flightHours: null, baseNightlyRate: 240, baseRoundCost: 95
    }
  ],

  "outer banks": [
    {
      name: "Outer Banks, North Carolina",
      region: "North Carolina",
      tags: ["coastal", "barrier island", "beach"],
      summary: "The OBX golf scene is smaller than Myrtle Beach but the beach-and-golf combination is hard to beat — wide open courses with ocean breezes and genuine coastal atmosphere.",
      driveHours: null, flightHours: 2.5, baseNightlyRate: 260, baseRoundCost: 95
    }
  ],

  ozarks: [
    {
      name: "Lake of the Ozarks, Missouri",
      region: "Missouri",
      tags: ["lake resort", "driveable", "group-friendly"],
      summary: "Lake of the Ozarks is the Midwest's most popular group trip destination — lake lodging, strong resort golf, and easy logistics from St. Louis and Kansas City.",
      driveHours: 4.0, flightHours: null, baseNightlyRate: 215, baseRoundCost: 82
    },
    {
      name: "Branson, Missouri",
      region: "Missouri",
      tags: ["resort", "entertainment", "family-friendly"],
      summary: "Branson's golf market has quietly grown — strong resort infrastructure, lake views, and entertainment options that keep the whole group happy.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 210, baseRoundCost: 80
    }
  ],

  // ── INTERNATIONAL ──────────────────────────────────────────────────────────

  scotland: [
    {
      name: "St Andrews & Fife, Scotland",
      region: "Fife, Scotland",
      tags: ["bucket list", "links", "historic"],
      summary: "St Andrews is the home of golf — the Old Course, Kingsbarns, Carnoustie, and the Castle Course are all within reach. No golf trip is more iconic.",
      driveHours: null, flightHours: 8.5, baseNightlyRate: 320, baseRoundCost: 220
    },
    {
      name: "Ayrshire & Turnberry, Scotland",
      region: "South Ayrshire, Scotland",
      tags: ["bucket list", "links", "coastal"],
      summary: "Royal Troon, Prestwick, and Trump Turnberry anchor one of the world's great golf corridors — rugged links golf with the Ailsa Craig as your backdrop.",
      driveHours: null, flightHours: 8.5, baseNightlyRate: 300, baseRoundCost: 195
    },
    {
      name: "East Lothian, Scotland",
      region: "East Lothian, Scotland",
      tags: ["links", "historic", "Edinburgh"],
      summary: "East Lothian's \"Golf Coast\" puts Muirfield, Gullane, and North Berwick within 30 minutes of Edinburgh — world-class links with easy city access.",
      driveHours: null, flightHours: 8.5, baseNightlyRate: 275, baseRoundCost: 175
    },
    {
      name: "Royal Dornoch & the Highlands, Scotland",
      region: "Highland, Scotland",
      tags: ["remote", "links", "bucket list"],
      summary: "Royal Dornoch is widely considered the best links course most golfers will ever play — remote Highland scenery and a warm clubhouse welcome make it unforgettable.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 255, baseRoundCost: 165
    }
  ],

  ireland: [
    {
      name: "Kerry & Southwest Ireland",
      region: "County Kerry, Ireland",
      tags: ["bucket list", "links", "coastal"],
      summary: "Ballybunion, Waterville, and Tralee form one of golf's great pilgrimages — wild Atlantic links, stunning scenery, and Irish hospitality at its best.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 280, baseRoundCost: 185
    },
    {
      name: "County Clare & The Burren, Ireland",
      region: "County Clare, Ireland",
      tags: ["links", "scenic", "unique"],
      summary: "Lahinch Golf Club sits beside one of Ireland's most dramatic coastlines — old Tom Morris links golf with the Cliffs of Moher just down the road.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 255, baseRoundCost: 160
    },
    {
      name: "Dublin & County Wicklow, Ireland",
      region: "Leinster, Ireland",
      tags: ["resort", "parkland", "city access"],
      summary: "The K Club, Mount Juliet, and Portmarnock put world-class parkland and links golf minutes from Dublin — easy international access with strong resort lodging.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 295, baseRoundCost: 170
    },
    {
      name: "Northern Ireland — Royal County Down & Portrush",
      region: "Northern Ireland",
      tags: ["bucket list", "links", "coastal"],
      summary: "Royal County Down and Royal Portrush are two of the top-ranked courses in the world — dramatic links golf on the Causeway Coast with stunning scenery.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 270, baseRoundCost: 190
    }
  ],

  england: [
    {
      name: "Lancashire & Royal Birkdale, England",
      region: "Lancashire, England",
      tags: ["links", "Open Championship", "coastal"],
      summary: "Royal Birkdale, Royal Lytham & St Annes, and Southport's championship links corridor is England's answer to Scotland's great links routes.",
      driveHours: null, flightHours: 8.5, baseNightlyRate: 270, baseRoundCost: 175
    },
    {
      name: "Kent & Royal St George's, England",
      region: "Kent, England",
      tags: ["links", "historic", "Open Championship"],
      summary: "Royal St George's and Prince's Golf Club anchor the Sandwich Bay links stretch — proper English links golf with easy access from London.",
      driveHours: null, flightHours: 8.0, baseNightlyRate: 265, baseRoundCost: 165
    },
    {
      name: "Surrey & Berkshire, England",
      region: "Home Counties, England",
      tags: ["parkland", "heathland", "historic"],
      summary: "Sunningdale, Wentworth, and the Surrey heathland belt rival anywhere in the world for parkland and heathland golf — 90 minutes from Heathrow.",
      driveHours: null, flightHours: 8.0, baseNightlyRate: 285, baseRoundCost: 180
    }
  ],

  portugal: [
    {
      name: "Algarve, Portugal",
      region: "Algarve, Portugal",
      tags: ["resort", "sunny", "value"],
      summary: "The Algarve is Europe's premier golf destination — Quinta do Lago, Vale do Lobo, and Vilamoura offer resort-quality courses with consistent sunshine and strong value vs. the UK.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 260, baseRoundCost: 130
    },
    {
      name: "Lisbon & Sintra, Portugal",
      region: "Estremadura, Portugal",
      tags: ["city access", "historic", "coastal"],
      summary: "Lisbon pairs exceptional golf (Penha Longa, Oitavos Dunes) with one of Europe's most exciting city scenes — a great add-on for groups who want culture alongside fairways.",
      driveHours: null, flightHours: 9.0, baseNightlyRate: 245, baseRoundCost: 115
    }
  ],

  spain: [
    {
      name: "Costa del Sol & Marbella, Spain",
      region: "Andalusia, Spain",
      tags: ["resort", "sunny", "variety"],
      summary: "The Costa del Sol packs more golf courses per square mile than almost anywhere in Europe — Valderrama, Real Club de Golf Sotogrande, and dozens of resort tracks in a sunny corridor.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 255, baseRoundCost: 120
    },
    {
      name: "Seville & Andalusia, Spain",
      region: "Andalusia, Spain",
      tags: ["historic", "parkland", "unique"],
      summary: "Andalusia's inland golf — Valderrama, Montecastillo, and Real Betis — pairs with one of Spain's most extraordinary cities for a trip that goes beyond the typical beach resort.",
      driveHours: null, flightHours: 9.5, baseNightlyRate: 240, baseRoundCost: 105
    }
  ],

  "new zealand": [
    {
      name: "Queenstown & Otago, New Zealand",
      region: "South Island, New Zealand",
      tags: ["bucket list", "mountain", "scenic"],
      summary: "Queenstown's dramatic alpine scenery frames some of the southern hemisphere's most spectacular golf — Jack's Point and Millbrook are world-class, and the adventure lifestyle is unmatched.",
      driveHours: null, flightHours: 17.0, baseNightlyRate: 310, baseRoundCost: 150
    },
    {
      name: "Auckland & Northland, New Zealand",
      region: "North Island, New Zealand",
      tags: ["coastal", "scenic", "resort"],
      summary: "The Northland peninsula has New Zealand's best coastal links golf — Kauri Cliffs and Cape Kidnappers are bucket-list tracks with stunning ocean views.",
      driveHours: null, flightHours: 17.0, baseNightlyRate: 285, baseRoundCost: 130
    }
  ],

  australia: [
    {
      name: "Melbourne Sandbelt, Australia",
      region: "Victoria, Australia",
      tags: ["bucket list", "sandbelt", "classic"],
      summary: "Melbourne's Sandbelt — Royal Melbourne, Kingston Heath, and Commonwealth — is consistently rated the best collection of courses outside the British Isles. A genuine bucket-list destination.",
      driveHours: null, flightHours: 16.5, baseNightlyRate: 295, baseRoundCost: 160
    },
    {
      name: "Sydney & New South Wales, Australia",
      region: "New South Wales, Australia",
      tags: ["coastal", "city access", "variety"],
      summary: "New South Wales Golf Club, Royal Sydney, and The Lakes put elite golf minutes from one of the world's great harbour cities.",
      driveHours: null, flightHours: 16.5, baseNightlyRate: 290, baseRoundCost: 145
    }
  ],

  mexico: [
    {
      name: "Los Cabos, Mexico",
      region: "Baja California Sur, Mexico",
      tags: ["resort", "desert", "ocean views"],
      summary: "Cabo's Quivira, Diamante, and Palmilla courses deliver dramatic desert-meets-ocean golf with full resort amenities — one of the most popular international golf destinations from the US.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 340, baseRoundCost: 195
    },
    {
      name: "Riviera Maya, Mexico",
      region: "Quintana Roo, Mexico",
      tags: ["resort", "beach", "tropical"],
      summary: "The Riviera Maya corridor from Cancún to Tulum combines championship golf (El Camaleón, Mayakoba) with full resort beach access — easy direct flights from most US cities.",
      driveHours: null, flightHours: 3.5, baseNightlyRate: 310, baseRoundCost: 175
    }
  ],

  "dominican republic": [
    {
      name: "Punta Cana & Casa de Campo, Dominican Republic",
      region: "La Altagracia, Dominican Republic",
      tags: ["resort", "beach", "Pete Dye"],
      summary: "Casa de Campo's Teeth of the Dog is one of the Caribbean's finest — Pete Dye clifftop design with seven holes along the sea. Punta Cana adds beach-resort polish nearby.",
      driveHours: null, flightHours: 4.0, baseNightlyRate: 295, baseRoundCost: 185
    }
  ],

  bahamas: [
    {
      name: "Nassau & Paradise Island, Bahamas",
      region: "New Providence, Bahamas",
      tags: ["resort", "beach", "tropical"],
      summary: "Albany Golf Club and the Ocean Club course anchor a Nassau golf trip with world-class resort amenities and short flights from most East Coast cities.",
      driveHours: null, flightHours: 3.0, baseNightlyRate: 350, baseRoundCost: 195
    }
  ],

  japan: [
    {
      name: "Tokyo & Kanto, Japan",
      region: "Kanto, Japan",
      tags: ["bucket list", "unique", "parkland"],
      summary: "Japan's golf culture is unique — immaculate conditioning, formal caddies, and courses set in ancient forest. Tokyo's Kanto region has hundreds of private-style clubs with guest access.",
      driveHours: null, flightHours: 14.5, baseNightlyRate: 310, baseRoundCost: 140
    },
    {
      name: "Kyoto & Kansai, Japan",
      region: "Kansai, Japan",
      tags: ["unique", "scenic", "cultural"],
      summary: "Pairing Kyoto's temples and cuisine with serious golf in the Kansai hills makes for a trip that stands apart — immaculate mountain courses and one of the world's greatest cultural cities.",
      driveHours: null, flightHours: 14.5, baseNightlyRate: 295, baseRoundCost: 130
    }
  ]

};

// Aliases for common alternate queries (lowercased)
const ALIASES: Record<string, string> = {
  // Northeast
  "new england": "maine",
  nh: "new hampshire",
  vt: "vermont",
  ri: "rhode island",
  ct: "connecticut",
  ma: "massachusetts",
  "cape cod": "massachusetts",
  berkshires: "massachusetts",
  hamptons: "new york",
  catskills: "new york",
  "finger lakes": "new york",
  adirondacks: "new york",
  "pine barrens": "new jersey",
  poconos: "pennsylvania",
  "laurel highlands": "pennsylvania",
  "french lick": "indiana",
  // Mid-Atlantic
  md: "maryland",
  va: "virginia",
  wv: "west virginia",
  pa: "pennsylvania",
  "ocean city": "maryland",
  "eastern shore": "maryland",
  williamsburg: "virginia",
  "homestead resort": "virginia",
  "hot springs": "virginia",
  greenbrier: "west virginia",
  // Southeast
  nc: "north carolina",
  sc: "south carolina",
  ga: "georgia",
  fl: "florida",
  al: "alabama",
  ms: "mississippi",
  tn: "tennessee",
  ky: "kentucky",
  pinehurst: "north carolina",
  asheville: "blue ridge",
  "blowing rock": "north carolina",
  "myrtle beach": "south carolina",
  "hilton head": "south carolina",
  kiawah: "south carolina",
  "pawleys island": "south carolina",
  "sea island": "georgia",
  "golden isles": "georgia",
  "jekyll island": "georgia",
  savannah: "georgia",
  "reynolds lake": "georgia",
  naples: "florida",
  "amelia island": "florida",
  destin: "florida",
  "palm beach": "florida",
  "panama city": "florida",
  "fort lauderdale": "florida",
  miami: "florida",
  tampa: "florida",
  orlando: "florida",
  "gulf shores": "alabama",
  nashville: "tennessee",
  gatlinburg: "tennessee",
  smoky: "tennessee",
  lexington: "kentucky",
  louisville: "kentucky",
  // Midwest
  mi: "michigan",
  wi: "wisconsin",
  mn: "minnesota",
  il: "illinois",
  in: "indiana",
  oh: "ohio",
  mo: "missouri",
  ia: "iowa",
  ks: "kansas",
  ne: "nebraska",
  nd: "north dakota",
  sd: "south dakota",
  "traverse city": "michigan",
  petoskey: "michigan",
  gaylord: "michigan",
  mackinac: "michigan",
  kohler: "wisconsin",
  "door county": "wisconsin",
  "whistling straits": "wisconsin",
  brainerd: "minnesota",
  alexandria: "minnesota",
  galena: "illinois",
  columbus: "ohio",
  cleveland: "ohio",
  branson: "ozarks",
  "lake of the ozarks": "ozarks",
  "kansas city": "missouri",
  "black hills": "south dakota",
  "sand hills": "nebraska",
  // Southwest
  az: "arizona",
  nm: "new mexico",
  tx: "texas",
  ok: "oklahoma",
  ar: "arkansas",
  la: "louisiana",
  scottsdale: "arizona",
  phoenix: "arizona",
  tucson: "arizona",
  sedona: "arizona",
  "white mountains az": "arizona",
  "palm springs": "california",
  "santa fe": "new mexico",
  "hill country": "texas",
  "san antonio": "texas",
  dallas: "texas",
  houston: "texas",
  austin: "texas",
  tulsa: "oklahoma",
  "new orleans": "louisiana",
  // Mountain West
  co: "colorado",
  ut: "utah",
  nv: "nevada",
  id: "idaho",
  mt: "montana",
  wy: "wyoming",
  vail: "colorado",
  steamboat: "colorado",
  telluride: "colorado",
  "colorado springs": "colorado",
  aspen: "colorado",
  "st george": "utah",
  "st. george": "utah",
  "park city": "utah",
  "las vegas": "nevada",
  tahoe: "nevada",
  "lake tahoe": "nevada",
  "sun valley": "idaho",
  "coeur d'alene": "idaho",
  "coeur dalene": "idaho",
  whitefish: "montana",
  billings: "montana",
  "jackson hole": "wyoming",
  jackson: "wyoming",
  // Pacific West
  ca: "california",
  or: "oregon",
  wa: "washington",
  hi: "hawaii",
  ak: "alaska",
  "pebble beach": "california",
  monterey: "california",
  carmel: "california",
  "wine country": "california",
  sonoma: "california",
  napa: "california",
  "san diego": "california",
  "san francisco": "california",
  "los angeles": "california",
  bandon: "oregon",
  portland: "oregon",
  bend: "oregon",
  seattle: "washington",
  spokane: "washington",
  maui: "hawaii",
  "big island": "hawaii",
  oahu: "hawaii",
  kauai: "hawaii",
  honolulu: "hawaii",
  anchorage: "alaska",
  // Canada
  banff: "canada",
  jasper: "canada",
  muskoka: "canada",
  pei: "canada",
  "prince edward island": "canada",
  alberta: "canada",
  ontario: "canada",
  "british columbia": "canada",
  // Named regions
  "blue ridge mountains": "blue ridge",
  "obx": "outer banks",
  "rtj trail": "alabama",
  "robert trent jones trail": "alabama",
  // International
  "st andrews": "scotland",
  "st. andrews": "scotland",
  "ayrshire": "scotland",
  "turnberry": "scotland",
  "carnoustie": "scotland",
  "royal troon": "scotland",
  "dornoch": "scotland",
  "edinburgh": "scotland",
  "glasgow": "scotland",
  "uk": "scotland",
  "united kingdom": "scotland",
  "great britain": "scotland",
  "ballybunion": "ireland",
  "waterville": "ireland",
  "lahinch": "ireland",
  "portmarnock": "ireland",
  "k club": "ireland",
  "northern ireland": "ireland",
  "royal portrush": "ireland",
  "royal county down": "ireland",
  "royal birkdale": "england",
  "sunningdale": "england",
  "wentworth": "england",
  "algarve": "portugal",
  "lisbon": "portugal",
  "marbella": "spain",
  "costa del sol": "spain",
  "seville": "spain",
  "queenstown": "new zealand",
  "auckland": "new zealand",
  "nz": "new zealand",
  "melbourne": "australia",
  "sydney": "australia",
  "au": "australia",
  "cabo": "mexico",
  "los cabos": "mexico",
  "cancun": "mexico",
  "cancún": "mexico",
  "riviera maya": "mexico",
  "punta cana": "dominican republic",
  "casa de campo": "dominican republic",
  "dr": "dominican republic",
  "nassau": "bahamas",
  "tokyo": "japan",
  "kyoto": "japan",
  "osaka": "japan"
};

/**
 * Find curated sub-destinations for a given query string.
 * Returns null if no match found — caller should generate generic fallback.
 */
export function findLocationDestinations(query: string): SubDestination[] | null {
  if (!query) return null;

  const normalized = query.trim().toLowerCase();

  // Direct catalog hit
  if (CATALOG[normalized]) return CATALOG[normalized];

  // Alias lookup
  const aliasKey = ALIASES[normalized];
  if (aliasKey && CATALOG[aliasKey]) return CATALOG[aliasKey];

  // Partial match — check if the query contains any catalog key
  for (const [key, destinations] of Object.entries(CATALOG)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return destinations;
    }
  }

  // Partial match through aliases — only match if the alias contains the query
  // (not the reverse: avoids "scotland".includes("sc") → South Carolina)
  for (const [alias, catalogKey] of Object.entries(ALIASES)) {
    if (alias.includes(normalized) && normalized.length >= 2) {
      const dests = CATALOG[catalogKey];
      if (dests) return dests;
    }
  }

  return null;
}

/**
 * Generate generic sub-destinations when no curated match exists.
 * Names the areas after the query so results feel location-relevant.
 */
export function generateGenericDestinations(
  query: string,
  baseNightlyRate: number,
  baseRoundCost: number
): SubDestination[] {
  const label = query.trim();

  return [
    {
      name: `${label} — Coastal & Resort Area`,
      region: label,
      tags: ["coastal", "resort", "group-friendly"],
      summary: `The coastal and resort corridor near ${label} offers polished infrastructure, solid public golf, and the easiest logistics for a group trip.`,
      driveHours: null,
      flightHours: 2.5,
      baseNightlyRate,
      baseRoundCost
    },
    {
      name: `Greater ${label}`,
      region: label,
      tags: ["city access", "variety", "easy travel"],
      summary: `The greater ${label} area gives the group the widest selection of courses at a range of price points, with strong hotel and rental options near the action.`,
      driveHours: null,
      flightHours: 2.5,
      baseNightlyRate: Math.max(180, baseNightlyRate - 25),
      baseRoundCost: Math.max(75, baseRoundCost - 15)
    },
    {
      name: `${label} — Lakes & Mountain Region`,
      region: label,
      tags: ["scenic", "mountain", "summer"],
      summary: `The inland lakes and mountain corridor around ${label} trades beach proximity for dramatic scenery and a more relaxed group trip pace.`,
      driveHours: null,
      flightHours: 2.8,
      baseNightlyRate: Math.max(190, baseNightlyRate - 10),
      baseRoundCost: Math.max(80, baseRoundCost - 5)
    }
  ];
}
