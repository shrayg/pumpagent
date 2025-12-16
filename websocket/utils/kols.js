const kols = [
  {
    wallet: "HLv6yCEpgjQV9PcKsvJpem8ESyULTyh9HjHn9CtqSek1",
    name: "lyxe",
    twitter: "https://x.com/cryptolyxe",
  },
  {
    wallet: "9jyqFiLnruggwNn4EQwBNFXwpbLM9hrA4hV59ytyAVVz",
    name: "nach",
    twitter: "https://x.com/NachSOL",
  },
  {
    wallet: "3kebnKw7cPdSkLRfiMEALyZJGZ4wdiSRvmoN4rD1yPzV",
    name: "bastille",
    twitter: "https://x.com/BastilleBtc",
  },
  {
    wallet: "GTvBQnRvAPweU2qmYg8MDLND2PAAyYFKe35aKQGMRDaL",
    name: "polar",
    twitter: "https://x.com/polarsterrr",
  },
  {
    wallet: "EHg5YkU2SZBTvuT87rUsvxArGp3HLeye1fXaSDfuMyaf",
    name: "til",
    twitter: "https://x.com/tilcrypto",
  },
  {
    wallet: "9FNz4MjPUmnJqTf6yEDbL1D4SsHVh7uA8zRHhR5K138r",
    name: "Danny",
    twitter: "https://x.com/0xSevere",
  },
  {
    wallet: "J2B5fnm2DAAUAGa4EaegwQFoYaN6B5FerGA5sjtQoaGM",
    name: "Dan176",
    twitter: "https://x.com/176Dan",
  },
  {
    wallet: "J6TDXvarvpBdPXTaTU8eJbtso1PUCYKGkVtMKUUY8iEa",
    name: "Pain",
    twitter: "https://x.com/PainCrypt0",
  },
  {
    wallet: "AmofvGJ59dgf5P85Pofip83pk7nZqrQRmSZvv5rRFVtf",
    name: "7xNick",
    twitter: "https://x.com/7xNickk",
  },
  {
    wallet: "E7gozEiAPNhpJsdS52amhhN2XCAqLZa7WPrhyR6C8o4S",
    name: "evening",
    twitter: "https://x.com/eveningbtc",
  },
  {
    wallet: "8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5",
    name: "daumeneth",
    twitter: "https://x.com/daumeneth",
  },
  {
    wallet: "CvNiezB8hofusHCKqu8irJ6t2FKY7VjzpSckofMzk5mB",
    name: "Dali",
    twitter: "https://x.com/SolanaDali",
  },
  {
    wallet: "CA4keXLtGJWBcsWivjtMFBghQ8pFsGRWFxLrRCtirzu5",
    name: "old",
    twitter: "https://x.com/old",
  },
  {
    wallet: "HrCPnDvDgbpbFxKxer6Pw3qEcfAQQNNjb6aJNFWgTEng",
    name: "0xWinged",
    twitter: "https://x.com/0xWinged",
  },
  {
    wallet: "HtvLcCFehifb7G4j42JDn53zD7sQRiELF5WHzJzNvWMm",
    name: "Polly",
    twitter: "https://x.com/0xsushi",
  },
  {
    wallet: "5B79fMkcFeRTiwm7ehsZsFiKsC7m7n1Bgv9yLxPp9q2X",
    name: "bandit",
    twitter: "https://x.com/bandeeeez",
  },
  {
    wallet: "9X5n5i1mugTjgGPhqf1KJDt8r4kD8TF3s62ttbxKzFHa",
    name: "dingaling",
    twitter: "https://x.com/dingalingts",
  },
  {
    wallet: "8deJ9xeUvXSJwicYptA9mHsU2rN2pDx37KWzkDkEXhU6",
    name: "CookerFlips",
    twitter: "https://x.com/CookerFlips",
  },
  {
    wallet: "8zFZHuSRuDpuAR7J6FzwyF3vKNx4CVW3DFHJerQhc7Zd",
    name: "pow",
    twitter: "https://x.com/traderpow",
  },
  {
    wallet: "5M8ACGKEXG1ojKDTMH3sMqhTihTgHYMSsZc6W8i7QW3Y",
    name: "Unipcs",
    twitter: "https://x.com/theunipcs",
  },
  {
    wallet: "7XwZnjto6bV1W8apxiETm9F6CHMDRRPLkG19ejy7t8dZ",
    name: "LilMoonLambo",
    twitter: "https://x.com/LilMoonLambo",
  },
  {
    wallet: "ApRnQN2HkbCn7W2WWiT2FEKvuKJp9LugRyAE1a9Hdz1",
    name: "s",
    twitter: "https://x.com/runitbackghost",
  },
  {
    wallet: "DGPYpCdiVg2shab2TnNiZ2RnsjBQSmhgN71hJyWC5cYn",
    name: "qwerty",
    twitter: "https://x.com/Quanterty",
  },
  {
    wallet: "GeXAHmmETnizW6af4E2e64ju8mTkLdEQzxUiAjJVo6NZ",
    name: "brox",
    twitter: "https://x.com/ohbrox",
  },
  {
    wallet: "B3wagQZiZU2hKa5pUCj6rrdhWsX3Q6WfTTnki9PjwzMh",
    name: "xander",
    twitter: "https://x.com/xandereef",
  },
  {
    wallet: "m7Kaas3Kd8FHLnCioSjCoSuVDReZ6FDNBVM6HTNYuF7",
    name: "ferb",
    twitter: "https://x.com/ferbsol",
  },
  {
    wallet: "GrD2umbfEBjQKFPDQvmmYNQ5eyRL9SAdWJj9FFMyeaDN",
    name: "TheSOLstice",
    twitter: "https://x.com/The__Solstice",
  },
  {
    wallet: "8m62CR82deo69gcJHuENbsnwi5DRhABrUdgTptmLMcbL",
    name: "asta",
    twitter: "https://x.com/AstaNFT",
  },
  {
    wallet: "AonDkSa2EZ19U365YrY3bKLDbLf7cU1herGFTGxXYrcm",
    name: "mrpunk",
    twitter: "https://x.com/mrpunkdoteth",
  },
  {
    wallet: "EkdbN4v1v88Z8LjxhXWgLc8m1iZUqxUMS6vzNvEdTJkU",
    name: "Meechie",
    twitter: "https://x.com/973Meech",
  },
  {
    wallet: "Gwv9NGzyQvUPYk7A5mhDXHVL88P39Eoz9omQ1SVgguMv",
    name: "gakealt",
    twitter: "https://x.com/Ga__ke",
  },
  {
    wallet: "3rSZJHysEk2ueFVovRLtZ8LGnQBMZGg96H2Q4jErspAF",
    name: "staqi",
    twitter: "https://x.com/staqi_",
  },
  {
    wallet: "F5TjPySiUJMdvqMZHnPP85Rc1vErDGV5FR5P2vdVm429",
    name: "Zyaf",
    twitter: "https://x.com/0xZyaf",
  },
  {
    wallet: "CRVidEDtEUTYZisCxBZkpELzhQc9eauMLR3FWg74tReL",
    name: "frank",
    twitter: "https://x.com/frankdegods",
  },
  {
    wallet: "831yhv67QpKqLBJjbmw2xoDUeeFHGUx8RnuRj9imeoEs",
    name: "Trey",
    twitter: "https://x.com/treysocial",
  },
  {
    wallet: "5B52w1ZW9tuwUduueP5J7HXz5AcGfruGoX6YoAudvyxG",
    name: "yenni",
    twitter: "https://x.com/Yennii56",
  },
  {
    wallet: "BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd",
    name: "dv",
    twitter: "https://x.com/vibed333",
  },
  {
    wallet: "FzVQSzj8JJr6WMGqbUHzx2XH1KkrfxRrRPv6WcbbZmND",
    name: "dust",
    twitter: "https://x.com/dustxbt",
  },
  {
    wallet: "BoYHJoKntk3pjkaV8qFojEonSPWmWMfQocZTwDd1bcGG",
    name: "Betman",
    twitter: "https://x.com/ImTheBetman",
  },
  {
    wallet: "7KbDtAdWnF8ZxDtSq59TCHnosQSe8Ggz1k5cbcXKhDss",
    name: "beaniemaxi",
    twitter: "https://x.com/beaniemaxi",
  },
  {
    wallet: "7QZGS7MQ4S6hRmE8iXoFTXgQ2hXVUCho2ZhgeWvLNPZT",
    name: "Murad",
    twitter: "https://x.com/MustStopMurad",
  },
  {
    wallet: "4cwjhp2mV7a13QqnacLJeGht85dW5ABpn7YKNUJrcJRk",
    name: "Rekt",
    twitter: "https://x.com/shy1_eth",
  },
  {
    wallet: "sAdNbe1cKNMDqDsa4npB3TfL62T14uAo2MsUQfLvzLT",
    name: "Ethan Prosper",
    twitter: "https://x.com/pr6spr",
  },
  {
    wallet: "Aaee1d7L6MwFrrguXjN6LU7GJ3CnW6b6z1m9e2yY7Bvu",
    name: "swanny",
    twitter: "https://x.com/swannycrypto",
  },
  {
    wallet: "GksRsUiYtDPe2NpeaEij6RxvJqw53W7gKNgih6X1QShM",
    name: "proseproducer",
    twitter: "https://x.com/ProseProducer",
  },
  {
    wallet: "5CoxdsuoRHDwDPVYqPoeiJxWZ588jXhpimCRJUj8FUN1",
    name: "fascist.eth",
    twitter: "https://x.com/studygreed",
  },
  {
    wallet: "J23qr98GjGJJqKq9CBEnyRhHbmkaVxtTJNNxKu597wsA",
    name: "gr3g",
    twitter: "https://x.com/gr3gor14n",
  },
  {
    wallet: "719sfKUjiMThumTt2u39VMGn612BZyCcwbM5Pe8SqFYz",
    name: "Fashr",
    twitter: "https://x.com/FASHRCrypto",
  },
  {
    wallet: "34ZEH778zL8ctkLwxxERLX5ZnUu6MuFyX9CWrs8kucMw",
    name: "groovy.eth",
    twitter: "https://x.com/0xGroovy",
  },
  {
    wallet: "UxuuMeyX2pZPHmGZ2w3Q8MysvExCAquMtvEfqp2etvm",
    name: "Pandora",
    twitter: "https://x.com/pandoraflips",
  },
  {
    wallet: "41CMkTohu1nXSKNexVxWYK3Xwe8Zgox9ag4CBruFBBv7",
    name: "kilorippy bullx",
    twitter: "https://x.com/kilorippy",
  },
  {
    wallet: "4DdrfiDHpmx55i4SPssxVzS9ZaKLb8qr45NKY9Er9nNh",
    name: "mr frog",
    twitter: "https://x.com/TheMisterFrog",
  },
  {
    wallet: "FhLXeB6rfDUpAjWLGPjh6kd6VvDzaW7GBKrdsLuewDGR",
    name: "Fabiano",
    twitter: "https://x.com/FabianoSolana",
  },
  {
    wallet: "DN7pYLSGYqHXwvPLh8tJM2zoJjhMSsNGVRVkMWVpredr",
    name: "Fabix",
    twitter: "https://x.com/Fabix_Sol",
  },
  {
    wallet: "3jLij9WF7AUXnQsj3ve19kej42oEuJnmzGsnxo4R8UCR",
    name: "Obey Raves",
    twitter: "https://x.com/Ravers",
  },
  {
    wallet: "4M8QVddY7Ld8eAaHoYcWKPxQcwxVuZsXMFKsm8921Uzd",
    name: "Kimchi",
    twitter: "https://x.com/kimchi1x",
  },
  {
    wallet: "G5nxEXuFMfV74DSnsrSatqCW32F34XUnBeq3PfDS7w5E",
    name: "Flipping profs",
    twitter: "https://x.com/FlippingProfits",
  },
  {
    wallet: "4YzpSZpxDdjNf3unjkCtdWEsz2FL5mok7e5XQaDNqry8",
    name: "xunle",
    twitter: "https://x.com/xunle111",
  },
  {
    wallet: "G3g1CKqKWSVEVURZDNMazDBv7YAhMNTjhJBVRTiKZygk",
    name: "Insyder",
    twitter: "https://x.com/insydercrypto",
  },
  {
    wallet: "4XMPyWFsYdNcCN4FG8geyytyTeUNacn4QundBzMqbGGT",
    name: "sStxticcss",
    twitter: "https://x.com/Stxticcss",
  },
  {
    wallet: "7SDs3PjT2mswKQ7Zo4FTucn9gJdtuW4jaacPA65BseHS",
    name: "Insentos",
    twitter: "https://x.com/insentos",
  },
  {
    wallet: "26kZ9rg8Y5pd4j1tdT4cbT8BQRu5uDbXkaVs3L5QasHy",
    name: "Orangie November",
    twitter: "https://x.com/orangie",
  },
  {
    wallet: "3pZ59YENxDAcjaKa3sahZJBcgER4rGYi4v6BpPurmsGj",
    name: "Kadenox",
    twitter: "https://x.com/kadenox",
  },
  {
    wallet: "DSVc1Rd69sLcXBoZAsvkzK4jGFyJKP77K3J2CaFVNAFP",
    name: "Pre",
    twitter: "https://x.com/pre_nft",
  },
  {
    wallet: "86AEJExyjeNNgcp7GrAvCXTDicf5aGWgoERbXFiG1EdD",
    name: "Sloppy",
    twitter: "https://x.com/SloppyStreamz",
  },
  {
    wallet: "J6p2MS1gjygk9Hod8vKUEfcuWqMwfAwqFJyJX7UC8p6b",
    name: "Dean Bulla",
    twitter: "https://x.com/deanbulla",
  },
  {
    wallet: "DZAa55HwXgv5hStwaTEJGXZz1DhHejvpb7Yr762urXam",
    name: "Ozark",
    twitter: "https://x.com/ohzarke",
  },
  {
    wallet: "2iJNcbQ7hjwLzcRqoo37xYaTPCRMHzfcdeUmNZHbFs55",
    name: "GVQ",
    twitter: "https://x.com/GVQ_xx",
  },
  {
    wallet: "4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t",
    name: "Mitch 1",
    twitter: "https://x.com/idrawline",
  },
  {
    wallet: "Ai5spT4zukruzSm8m67ro1E2iuu92foU1fi1EvhMTPxj",
    name: "Mitch 2",
    twitter: "https://x.com/idrawline",
  },
  {
    wallet: "5t9xBNuDdGTGpjaPTx6hKd7sdRJbvtKS8Mhq6qVbo8Qz",
    name: "Smokez",
    twitter: "https://x.com/SmokezXBT",
  },
  {
    wallet: "GwoFJFjUTUSWq2EwTz4P2Sznoq9XYLrf8t4q5kbTgZ1R",
    name: "Levis",
    twitter: "https://x.com/LevisNFT",
  },
  {
    wallet: "3d1k12tbQahBRBHccU7QkfyfVGNd7ZJ7wE4GpQuntNbE",
    name: "Fullstacktard",
    twitter: "https://x.com/fullstacktard",
  },
  {
    wallet: "AVAZvHLR2PcWpDf8BXY4rVxNHYRBytycHkcB5z5QNXYm",
    name: "Ansem",
    twitter: "https://x.com/blknoiz06",
  },
  {
    wallet: "3h65MmPZksoKKyEpEjnWU2Yk2iYT5oZDNitGy5cTaxoE",
    name: "jidn",
    twitter: "https://x.com/jidn_w",
  },
  {
    wallet: "4BdKaxN8G6ka4GYtQQWk4G4dZRUTX2vQH9GcXdBREFUk",
    name: "Jijo",
    twitter: "https://x.com/jijo_exe",
  },
  {
    wallet: "GQWLRHtR18vy8myoHkgc9SMcSzwUdBjJ816vehSBwcis",
    name: "Joji",
    twitter: "https://x.com/metaversejoji",
  },
  {
    wallet: "DKwybycDSWidrHfpMjaahUsT1Yid3kig86ncXPAGe7AU",
    name: "Yogurt",
    twitter: "https://x.com/yogurt_eth",
  },
  {
    wallet: "HUS9ErdrDqpqQePbmfgJUTnDTE6eZ8ES62a25RihSK9U",
    name: "Hustler",
    twitter: "https://x.com/JoeVargas",
  },
  {
    wallet: "GJA1HEbxGnqBhBifH9uQauzXSB53to5rhDrzmKxhSU65",
    name: "Latuche",
    twitter: "https://x.com/Latuche95",
  },
  {
    wallet: "3i8akM4xfSX9WKFB5bQ61fmiYkeKQEFqvdMEyu6pSEk9",
    name: "Moneymakah",
    twitter: "https://x.com/moneymaykah_",
  },
  {
    wallet: "6Qs6joB349h7zu1z9xRgPgMSmpBYLDQb2wtAecY4LysH",
    name: "Chefin",
    twitter: "https://x.com/Chefin100x",
  },
  {
    wallet: "suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK",
    name: "Cupsey",
    twitter: "https://x.com/Cupseyy",
  },
  {
    wallet: "5M8ACGKEXG1ojKDTMH3sMqhTihTgHYMSsZc6W8i7QW3Y",
    name: "Unipcs",
    twitter: "https://x.com/theunipcs",
  },
  {
    wallet: "DYmsQudNqJyyDvq86XmzAvrU9T7xwfQEwh6gPQw9TPNF",
    name: "unprofitable",
    twitter: "https://x.com/exitliquid1ty",
  },
  {
    wallet: "Aen6LKc7sGVPTyjMd5cu9B9XVjL7m9pnvAiP2ZNJC4GZ",
    name: "Aroa",
    twitter: "https://x.com/AroaOnSol",
  },
  {
    wallet: "AGL1dCZsF7Pv6jLDMc9xrNELZwb2oecVjrTBK7PpWX4i",
    name: "CoinGurruu",
    twitter: "https://x.com/CoinGurruu",
  },
  {
    wallet: "Ehqd8q5rAN8V7Y7EGxYm3Tp4KPQMTVWQtzjSSPP3Upg3",
    name: "Collectible",
    twitter: "https://x.com/collectible",
  },
  {
    wallet: "53cHphgeQszE3JbLGLgcnY7yMmy6cpvW9xQQS4Ap9EQi",
    name: "Publix",
    twitter: "https://x.com/publixplays",
  },
  {
    wallet: "8rvAsDKeAcEjEkiZMug9k8v1y8mW6gQQiMobd89Uy7qR",
    name: "casino",
    twitter: "https://x.com/casino616",
  },
  {
    wallet: "D1H83ueSw5Nxy5okxH7VBfV4jRnqAK5Mm1tm3JAj3m5t",
    name: "Jeets",
    twitter: "https://x.com/ieatjeets",
  },
  {
    wallet: "G1pRtSyKuWSjTqRDcazzKBDzqEF96i1xSURpiXj3yFcc",
    name: "CryptoD",
    twitter: "https://x.com/CryptoDevinL",
  },
  {
    wallet: "E37HKTRy2mqpwD6EM8fZdPUjLKQCz38zFMKoTcbR6vnu",
    name: "Orangie",
    twitter: "https://x.com/orangie",
  },
  {
    wallet: "AGnd5WTHMUbyK3kjjQPdQFM3TbWcuPTtkwBFWVUwiCLu",
    name: "Angi",
    twitter: "https://x.com/angitradez",
  },
  {
    wallet: "As7HjL7dzzvbRbaD3WCun47robib2kmAKRXMvjHkSMB5",
    name: "Otta",
    twitter: "https://x.com/ottabag",
  },
  {
    wallet: "4AHgEkTsGqY77qtde4UJn9yZCrbGcM7UM3vjT3qM4G5H",
    name: "BagCalls",
    twitter: "https://x.com/BagCalls",
  },
  {
    wallet: "4ZdCpHJrSn4E9GmfP8jjfsAExHGja2TEn4JmXfEeNtyT",
    name: "Robo",
    twitter: "https://x.com/roboPBOC",
  },
  {
    wallet: "8hKZKqCgZWxnvRz1XAvmbuzCAfqo5xFjH17vM2J2HTe1",
    name: "Exy",
    twitter: "https://x.com/eth_exy",
  },
  {
    wallet: "C4BWYccLsbeHgZzVupFZJGvJK2nQpn8em9WtzURH4gZW",
    name: "Obijai",
    twitter: "https://x.com/Obijai",
  },
  {
    wallet: "73LnJ7G9ffBDjEBGgJDdgvLUhD5APLonKrNiHsKDCw5B",
    name: "Waddles",
    twitter: "https://x.com/waddles_eth",
  },
  {
    wallet: "DNfuF1L62WWyW3pNakVkyGGFzVVhj4Yr52jSmdTyeBHm",
    name: "Gake",
    twitter: "https://x.com/ga__ke",
  },
  {
    wallet: "2pUUZYtokRgDV2YzL6M5pjb1jyoHE367yU1sdQ7ac3ea",
    name: "Log",
    twitter: "https://x.com/Log100x",
  },
  {
    wallet: "AbcX4XBm7DJ3i9p29i6sU8WLmiW4FWY5tiwB9D6UBbcE",
    name: "404Flipped",
    twitter: "https://x.com/404flipped",
  },
  {
    wallet: "JDd3hy3gQn2V982mi1zqhNqUw1GfV2UL6g76STojCJPN",
    name: "Kev",
    twitter: "https://x.com/kevsznx",
  },
  {
    wallet: "BHREKFkPQgAtDs8Vb1UfLkUpjG6ScidTjHaCWFuG2AtX",
    name: "Risk",
    twitter: "https://x.com/risk100x",
  },
  {
    wallet: "14HDbSrjCJKgwCXDBXv8PGRGFaLrAqDBq2mCwSA46q5x",
    name: "0xMistBlade",
    twitter: "https://x.com/0xMistBlade",
  },
  {
    wallet: "DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj",
    name: "Euris",
    twitter: "https://x.com/Euris_x",
  },
  {
    wallet: "6S8GezkxYUfZy9JPtYnanbcZTMB87Wjt1qx3c6ELajKC",
    name: "Nyhrox",
    twitter: "https://x.com/nyhrox",
  },
  {
    wallet: "AE3tJDEyUdwBM8ZoUb3iCo563gMbq26JtckfvjcVZbSa",
    name: "Roxo",
    twitter: "https://x.com/ignRoxo",
  },
  {
    wallet: "9yYya3F5EJoLnBNKW6z4bZvyQytMXzDcpU5D6yYr4jqL",
    name: "Loopierr",
    twitter: "https://x.com/loopierr",
  },
  {
    wallet: "6LChaYRYtEYjLEHhzo4HdEmgNwu2aia8CM8VhR9wn6n7",
    name: "Assasin.eth",
    twitter: "https://x.com/assasin_eth",
  },
  {
    wallet: "EaVboaPxFCYanjoNWdkxTbPvt57nhXGu5i6m9m6ZS2kK",
    name: "Danny",
    twitter: "https://x.com/cladzsol",
  },
  {
    wallet: "5rkPDK4JnVAumgzeV2Zu8vjggMTtHdDtrsd5o9dhGZHD",
    name: "Dave Portnoy",
    twitter: "https://x.com/stoolpresidente",
  },
  {
    wallet: "5AyJw1VNDgTho2chipbVmuGqTuX1fCvVkLneChQkQrw8",
    name: "bolivian",
    twitter: "https://x.com/_bolivian",
  },
  {
    wallet: "ApRnQN2HkbCn7W2WWiT2FEKvuKJp9LugRyAE1a9Hdz1",
    name: "solkcrow",
    twitter: "https://x.com/solkcrow",
  },
  {
    wallet: "96sErVjEN7LNJ6Uvj63bdRWZxNuBngj56fnT9biHLKBf",
    name: "Orange",
    twitter: "https://x.com/orangesbs",
  },
  {
    wallet: "7Dt5oUpxHWuKH8bCTXDLz2j3JyxA7jEmtzqCG6pnh96X",
    name: "Leens",
    twitter: "https://x.com/leensx100",
  },
  {
    wallet: "99i9uVA7Q56bY22ajKKUfTZTgTeP5yCtVGsrG9J4pDYQ",
    name: "Zrool",
    twitter: "https://x.com/TheRealZrool",
  },
  {
    wallet: "EgzjRCbcdRiPc1bW52tcvGDnKDbQWCzQbUhDBszD2BZm",
    name: "Rev",
    twitter: "https://x.com/solrevv",
  },
  {
    wallet: "7KqmgKkDrAfZhLG7w57gYdkYhyLYE7mVck5MjkYRHaSG",
    name: "Phineas.SOL",
    twitter: "https://x.com/Phineas_Sol",
  },
  {
    wallet: "FRbUNvGxYNC1eFngpn7AD3f14aKKTJVC6zSMtvj2dyCS",
    name: "Henn100x",
    twitter: "https://x.com/henn100x",
  },
  {
    wallet: "4WPTQA7BB4iRdrPhgNpJihGcxKh8T43gLjMn5PbEVfQw",
    name: "Oura",
    twitter: "https://x.com/Oura456",
  },
  {
    wallet: "BD7oWkEQsUwE8sj4UT7jtrGjHC8Gq1iRqXY7U6DTbJpf",
    name: "Gh0stee",
    twitter: "https://x.com/4gh0stee",
  },
  {
    wallet: "8oQoMhfBQnRspn7QtNAq2aPThRE4q94kLSTwaaFQvRgs",
    name: "big bags bobby",
    twitter: "https://x.com/bigbagsbobby",
  },
  {
    wallet: "722tXm5uB5uuG2tC43uKHXQ7Pbyz75pTokEAJv9x5VTx",
    name: "solanaplays",
    twitter: "https://x.com/SolanaPlays",
  },
  {
    wallet: "7tiRXPM4wwBMRMYzmywRAE6jveS3gDbNyxgRrEoU6RLA",
    name: "Qtdegen",
    twitter: "https://x.com/qtdegen",
  },
  {
    wallet: "BXNiM7pqt9Ld3b2Hc8iT3mA5bSwoe9CRrtkSUs15SLWN",
    name: "Absol",
    twitter: "https://x.com/absolquant",
  },
  {
    wallet: "215nhcAHjQQGgwpQSJQ7zR26etbjjtVdW74NLzwEgQjP",
    name: "OGAntD",
    twitter: "https://x.com/0GAntD",
  },
  {
    wallet: "7VBTpiiEjkwRbRGHJFUz6o5fWuhPFtAmy8JGhNqwHNnn",
    name: "Brox",
    twitter: "https://x.com/ohbrox",
  },
  {
    wallet: "xXpRSpAe1ajq4tJP78tS3X1AqNwJVQ4Vvb1Swg4hHQh",
    name: "aloh",
    twitter: "https://x.com/alohquant",
  },
  {
    wallet: "GfXQesPe3Zuwg8JhAt6Cg8euJDTVx751enp9EQQmhzPH",
    name: "Spuno",
    twitter: "https://x.com/spunosounds",
  },
  {
    wallet: "EAnB5151L8ejp3SM6haLgyv3snk6oqc8acKgWEg9T5J",
    name: "Jordan",
    twitter: "https://x.com/ohfrostyyy",
  },
  {
    wallet: "7CeeipDnoTVE343cfmNuaEPL1BWLBzFKL2jzHcqBXN9c",
    name: "Zinc",
    twitter: "https://x.com/zinc_eth",
  },
  {
    wallet: "7ABz8qEFZTHPkovMDsmQkm64DZWN5wRtU7LEtD2ShkQ6",
    name: "Red",
    twitter: "https://x.com/redwithbag",
  },
  {
    wallet: "4vw54BmAogeRV3vPKWyFet5yf8DTLcREzdSzx4rw9Ud9",
    name: "Decu",
    twitter: "https://x.com/decu0x",
  },
  {
    wallet: "mW4PZB45isHmnjGkLpJvjKBzVS5NXzTJ8UDyug4gTsM",
    name: "Dex",
    twitter: "https://x.com/igndex",
  },
  {
    wallet: "Bqcnecs7uv1cakup5daGToD3mUAiErHouGKvtk3VCmp2",
    name: "Wolf",
    twitter: "https://x.com/sharpinvestr",
  },
  {
    wallet: "2BU3NAzgRA2gg2MpzwwXpA8X4CCRaLgrf6TY1FKfJPX2",
    name: "Issa",
    twitter: "https://x.com/issathecooker",
  },
  {
    wallet: "AMNDjQBYdPhLMKbzwUggXdaWGZJ15Gqfw6trsdjmAS4p",
    name: "Polar",
    twitter: "https://x.com/polarsterrr",
  },
  {
    wallet: "4S8YBCt6hhi7Nr1NnKF6jF856LLN8JJFzD1a8nF5UuHA",
    name: "Shaka",
    twitter: "https://x.com/solanashaka",
  },
  {
    wallet: "F2SuErm4MviWJ2HzKXk2nuzBC6xe883CFWUDCPz6cyWm",
    name: "Earl",
    twitter: "https://x.com/earltrades",
  },
  {
    wallet: "AXwssg5NjQodKofcLV6ypJL4R5usvysYt9q7YVwjEgAH",
    name: "Sue",
    twitter: "https://x.com/sue_xbt",
  },
  {
    wallet: "3BLjRcxWGtR7WRshJ3hL25U3RjWr5Ud98wMcczQqk4Ei",
    name: "Sebastian",
    twitter: "https://x.com/Saint_pablo123",
  },
  {
    wallet: "BuhkHhM3j4viF71pMTd23ywxPhF35LUnc2QCLAvUxCdW",
    name: "Saif",
    twitter: "https://x.com/degensaif",
  },
  {
    wallet: "HA1L7GhQfypSRdfBi3tCkkCVEdEcBVYqBSQCENCrwPuB",
    name: "Hail",
    twitter: "https://x.com/ignHail",
  },
  {
    wallet: "BtMBMPkoNbnLF9Xn552guQq528KKXcsNBNNBre3oaQtr",
    name: "Letterbomb",
    twitter: "https://x.com/ihateoop",
  },
  {
    wallet: "525LueqAyZJueCoiisfWy6nyh4MTvmF4X9jSqi6efXJT",
    name: "Joji",
    twitter: "https://x.com/metaversejoji",
  },
  {
    wallet: "6HJetMbdHBuk3mLUainxAPpBpWzDgYbHGTS2TqDAUSX2",
    name: "LJC",
    twitter: "https://x.com/OnlyLJC",
  },
  {
    wallet: "AJ6MGExeK7FXmeKkKPmALjcdXVStXYokYNv9uVfDRtvo",
    name: "Tim",
    twitter: "https://x.com/timmpix1",
  },
  {
    wallet: "2T5NgDDidkvhJQg8AHDi74uCFwgp25pYFMRZXBaCUNBH",
    name: "Idontpaytaxes",
    twitter: "https://x.com/untaxxable",
  },
  {
    wallet: "215nhcAHjQQGgwpQSJQ7zR26etbjjtVdW74NLzwEgQjP",
    name: "AP",
    twitter: "https://x.com/verybrickedup",
  },
  {
    wallet: "BPWsae36tY6oFz7f5MjsfTGqzi3ttM1AsAtjMvUb91tT",
    name: "Rizz",
    twitter: "https://x.com/sollrizz",
  },
  {
    wallet: "9BkauJdFYUyBkNBZwV4mNNyfeVKhHvjULb7cL4gFQaLt",
    name: "goob",
    twitter: "https://x.com/ifullclipp",
  },
  {
    wallet: "4uTeAz9TmZ1J5bNkgGLvqAELvCHJwLZgo7Hxar2KAiyu",
    name: "Monarch",
    twitter: "https://x.com/MonarchBTC",
  },
  {
    wallet: "c3XGUoDSBaJDA8qaJ5pUkCnamMERwZLJBVjxdkNepGo",
    name: "Moggi",
    twitter: "https://x.com/10piecedawg",
  },
  {
    wallet: "7dP8DmRka5rmQti4zEEDjdAyaQyvFsPkcXMjEKJucqCu",
    name: "JB",
    twitter: "https://x.com/Jeetburner",
  },
  {
    wallet: "42nsEk51owYM3uciuRvFerqK77yhXZyjBLRgkDzJPV2g",
    name: "Izzy",
    twitter: "https://x.com/degenIzzy",
  },
  {
    wallet: "3nvC8cSrEBqFEXZjUpKfwZMPk7xYdqcnoxmFBjXiizVX",
    name: "Value & Time",
    twitter: "https://x.com/valueandtime",
  },
  {
    wallet: "mog6C8F5abi2XrLd9Jhr9dACoKKLJk4VacX2CbYmBZ7",
    name: "mog",
    twitter: "https://x.com/10piecedawg",
  },
  {
    wallet: "DpNVrtA3ERfKzX4F8Pi2CVykdJJjoNxyY5QgoytAwD26",
    name: "Gorilla Capital",
    twitter: "https://x.com/gorillacapsol",
  },
  {
    wallet: "4Bq5yvgoiZDsukGERb7aM52jDmbVPCpoihbztscZ5PeM",
    name: "ShockedJS",
    twitter: "https://x.com/shockedjs",
  },
  {
    wallet: "Ebk5ATdfrCuKi27dHZaw5YYsfREEzvvU8xeBhMxQoex6",
    name: "Sully",
    twitter: "https://x.com/sullyfromDeets",
  },
  {
    wallet: "B3beyovNKBo4wF1uFrfGfpVeyEHjFyJPmEBciz7kpnoS",
    name: "CC2",
    twitter: "https://x.com/cc2ventures",
  },
  {
    wallet: "DBmRHNbSsVX8F6NyVaaaiuGdwo1aYGawiy3jfNcvXYSC",
    name: "Bobby",
    twitter: "https://x.com/retardmode",
  },
  {
    wallet: "B7FDzJnb7DLYH1A37tKEFss1RRSz5C7MYgTRRMaWzBqa",
    name: "Lucas",
    twitter: "https://x.com/LockedInLucas",
  },
  {
    wallet: "Ds8mcuP5r2phg596mLui3ti3PJtVvFRw19Eo9UFdJ5Bc",
    name: "Jazz",
    twitter: "https://x.com/youngjazzeth",
  },
  {
    wallet: "F72vY99ihQsYwqEDCfz7igKXA5me6vN2zqVsVUTpw6qL",
    name: "Jalen",
    twitter: "https://x.com/RipJalens",
  },
  {
    wallet: "GM7Hrz2bDq33ezMtL6KGidSWZXMWgZ6qBuugkb5H8NvN",
    name: "Beaver",
    twitter: "https://x.com/beaverd",
  },
  {
    wallet: "HCQb4Qrtk4qCfChDH8XvM5onymmCSmRj9bddV6QCPdRe",
    name: "Rektober",
    twitter: "https://x.com/rektober",
  },
  {
    wallet: "GP9PyTwGybX3q3tC5dMRKeuq8Dr15uPVvn3Z9fKbempH",
    name: "Sweep",
    twitter: "https://x.com/0xSweep",
  },
  {
    wallet: "Hq5TTULwwmDjGvzQukgujHQogZ5uFSCyYHpP756Uvyae",
    name: "s0ber",
    twitter: "https://x.com/whaIecrypto",
  },
  {
    wallet: "9K18MstUaXmSFSBoa9qDTqWTnYhTZqdgEhuKRTVRgh6g",
    name: "Sabby",
    twitter: "https://x.com/sabby_eth",
  },
  {
    wallet: "9NL6thsiaoyDnm7XF8hEbMoqeG172WmG7iKYpygvjfgo",
    name: "Scooter",
    twitter: "https://x.com/imperooterxbt",
  },
  {
    wallet: "9UHDRLLLFNzmnnguJkhCDJTwx2fYyHfjjdagwieCzz3q",
    name: "Michi",
    twitter: "https://x.com/michigems",
  },
  {
    wallet: "8FaNi7XawZVC17sci13dHi2NeyNTQgjZyrBxwgyMEfj1",
    name: "Midjet",
    twitter: "https://x.com/MidjetV2",
  },
  {
    wallet: "DsqRyTUh1R37asYcVf1KdX4CNnz5DKEFmnXvgT4NfTPE",
    name: "Classic",
    twitter: "https://x.com/mrclassic33",
  },
  {
    wallet: "EdDCRfDDeiiDXdntrP59abH4DXHFNU48zpMPYisDMjA7",
    name: "Mezoteric",
    twitter: "https://x.com/mezoteric",
  },
  {
    wallet: "HwRnKq7RPtKHvX9wyHsc1zvfHtGjPQa5tyZtGtbvfXE",
    name: "Jay",
    twitter: "https://x.com/BitBoyJay",
  },
  {
    wallet: "EgnY4zmqXuaqodCLW366jjd2ecki6pvmMF74MkSxMFQW",
    name: "Eric Cryptoman",
    twitter: "https://x.com/EricCryptoman",
  },
  {
    wallet: "DnjhUSUo9vaywQ1DMxx9KWo5xZ4pPHoAn5aVnG5VwAso",
    name: "Ofye",
    twitter: "https://x.com/ycxofye",
  },
  {
    wallet: "ExKCuoAzJCgCVjU3CvNoL8vVrdESTWkx3ubj6rQXwQM4",
    name: "TheDefiApe",
    twitter: "https://x.com/thedefiape",
  },
  {
    wallet: "Av3xWHJ5EsoLZag6pr7LKbrGgLRTaykXomDD5kBhL9YQ",
    name: "Hetitsyolo",
    twitter: "https://x.com/Heyitsyolotv",
  },
  {
    wallet: "9Vk7pkBZ9KFJmzaPzNYjGedyz8qoKMQtnYyYi2AehNMT",
    name: "Xelf",
    twitter: "https://x.com/xelf_sol",
  },
  {
    wallet: "4Bdn33fA7LLZQuuXuFLSxtPWGAUnMBcreQHfh9MXuixe",
    name: "Key",
    twitter: "https://x.com/w3b3k3y",
  },
  {
    wallet: "7i7vHEv87bs135DuoJVKe9c7abentawA5ydfWcWc8iY2",
    name: "ChartFu",
    twitter: "https://x.com/ChartFuMonkey",
  },
  {
    wallet: "81do2WczLgbWxHQvJLZvC8WM5ost6MhjqqUpBsEsqGMc",
    name: "Sachs",
    twitter: "https://x.com/gudmansachs",
  },
  {
    wallet: "CkPFGv2Wv1vwdWjtXioEgb8jhZQfs3eVZez3QCetu7xD",
    name: "Lynk",
    twitter: "https://x.com/lynk0x",
  },
  {
    wallet: "5wcc13mXoyqe6qh2iHH5GFknojoJ7y13ZPx9K4NXTuo3",
    name: "Dolo",
    twitter: "https://x.com/doloxbt",
  },
  {
    wallet: "CCUcjek5p6DLoH2YNtjizxYhAnStXAQAGVxhp1cYJF7w",
    name: "el charto",
    twitter: "https://x.com/elchartox",
  },
  {
    wallet: "3mPypxb7ViYEdLv4siFmESvY5w5ZKknwgmB4TPcZ77qe",
    name: "CartiTheMenace",
    twitter: "https://x.com/cartithemenace",
  },
];

export { kols };
