# FormulaOne Card

[![GH-release](https://img.shields.io/github/v/release/marcokreeft87/formulaone-card.svg?style=flat-square)](https://github.com/marcokreeft87/formulaone-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/marcokreeft87/formulaone-card.svg?style=flat-square)](https://github.com/marcokreeft87/formulaone-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/marcokreeft87/formulaone-card.svg?color=red&style=flat-square)](https://github.com/marcokreeft87/formulaone-card)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=flat-square)](https://github.com/hacs/default)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/marcokreeft87/formulaone-card/main.svg?style=flat-square)](https://codecov.io/gh/marcokreeft87/formulaone-card/)
[![CodeFactor](https://www.codefactor.io/repository/github/marcokreeft87/formulaone-card/badge?style=flat-square)](https://www.codefactor.io/repository/github/marcokreeft87/formulaone-card)


Present the data of [Formula One](https://ergast.com/mrd/) in a pretty way 

Watch a demo of the card by BeardedTinker!

[![Demo of BeardedTinker](https://img.youtube.com/vi/z7blY6D-Qmk/0.jpg)](https://www.youtube.com/watch?v=z7blY6D-Qmk)

## Installation


### HACS (recommended)
Make sure you have [HACS](https://hacs.xyz/) (Home Assistant Community Store) installed.
<br>
<sub>_HACS is a third party community store and is not included in Home Assistant out of the box._</sub>

Just click here to directly go to the repository in HACS and click "Download": [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=marcokreeft87&repository=formulaone-card&category=plugin)

Or: 
- Open HACS
- Go to "Frontend" section
- Click button with "+" icon
- Search for "formulaone-card"
- Click "Download" button and install repository in HACS

In both situations:
- _If u are using YAML mode then add this to your_ [Lovelace resources](https://my.home-assistant.io/redirect/lovelace_resources/)
  ```yaml
  url: /hacsfiles/formulaone-card/formulaone-card.js
  type: module
  ```
- Refresh your browser

### Manual install
Manually download [formulaone-card.js](https://raw.githubusercontent.com/marcokreeft87/formulaone-card/master/formulaone-card.js) and add it 
to your `<config>/www/` folder and add the following to the `configuration.yaml` file:
```yaml
lovelace:
  resources:
    - url: /local/formulaone-card.js
      type: module
```


The above configuration can be managed directly in the Configuration -> Lovelace Dashboards -> Resources panel when not using YAML mode,
or added by clicking the "Add to lovelace" button on the HACS dashboard after installing the plugin.

## Configuration

| Name              | Type          | Default                             | Description                                      |
| ----------------- | ------------- | ----------------------------------- | ------------------------------------------------ |
| type              | string        | **Required**                        | `custom:formulaonecard`                          |
| card_type         | string        | **Required**                        | The type of card you want to display (driver_standings,constructor_standings,next_race,schedule,last_result,results,countdown)            |
| title             | string        |                                     | The header of the card ( hidden when null or empty)            |
| date_locale       | string        |                                     | Override the locale used for the date and time formatting. [Available options listed here](https://www.w3.org/International/O-charset-lang.html)|
| image_clickable   | boolean       | `false`                             | Click on image leads to wikipedia, or not   |
| show_carnumber    | boolean       | `false`                             | Show the number of the car   |
| show_raceinfo     | boolean       | `false`                             | Show the info of the race in the countdown and next_race card |
| hide_tracklayout  | boolean       | `false`                             | Hide the track layout image in the card |
| hide_racedatetimes | boolean       | `false`                        | Hide the race information (dates and times of the qualifications/race/sprint) in the card |
| f1_font           | boolean       | `false`                             | Use the official F1 font for headers |
| location_clickable| boolean       | `false`                             | Click on the location leads to wikipedia   |
| previous_race     | enum          |                           |   Hide/strikethrough or make the past races italic options are (hide, strikethrough or italic) |
| standings         | object        |                                     | Configuration for the driver standings card     |
| translations      | dictionary    |  _[translations](#Translations)_          | Dictionary to override the default translation  |
| actions           | object        |  _[Actions](#actions)_                                    | The tap, double tap or hold actions set on the image of the countdown, last_result, results, qualifying_results and next-race cards |
| row_limit         | number        |                                     | Limit the schedule, results, last_result, driver_standings and constructor_standings to this amount of row |
| countdown_type    | string or array | 'race'                              | Set the event to countdown to (race,qualifying,practice1,practice2,practice3,sprint) |
| show_weather      | boolean       | `false`                             | Show the _[weather forecast](#Forecast)_ of the upcoming race |
| next_race_delay   | number        |                                     | Delay (in hours) before the card switches to the next race |
| show_lastyears_result | boolean   | `false`                             | Show the winner of last year (next_race, countdown) |
| only_show_date    | boolean       | `false`                             | Show the date of the next race (next_race)          |
| tabs_order        | array         |'results', 'qualifying', 'sprint'    | Determine the order of the tabs (result)    |


### Actions

This card supports all the default HA actions, except from more-info and toggle. See [Lovelace Actions](https://www.home-assistant.io/lovelace/actions/)
for more detailed descriptions and examples.

| Name            | Type        | Default      | Description                                                                                |
| --------------- | ----------- | ------------ | ------------------------------------------------------------------------------------------ |
| action          | string      | **Required** | `call-service`, `url`, `navigate`, `fire-dom-event`, `none`         |
| service         | string      |              | Service to call when `action` is `call-service`                                            |
| service_data    | object      |              | Optional data to include when `action` is `call-service`                                   |
| url_path        | string      |              | URL to open when `action` is `url`                                                         |
| navigation_path | string      |              | Path to navigate to when `action` is `navigate`                                            |
| confirmation    | bool/object | `false`      | Enable confirmation dialog                                                                 |
| haptic          | string      | `none`       | Haptic feedback (`success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection`) |

Actions example:

```yaml
type: custom:formulaone-card
card_type: next_race
show_raceinfo: true
actions:
  tap_action:
    action: navigate
    navigation_path: /lovelace/overview

```

## Example configurations

### Next race

```yaml
type: custom:formulaone-card
card_type: next_race
title: Next Race
date_locale: nl
image_clickable: false
```

![image](https://user-images.githubusercontent.com/10223677/194120592-3df715bc-888d-460b-8743-ec1ab6017b96.png)

### Constructor standings

```yaml
type: custom:formulaone-card
card_type: constructor_standings
title: Constructor Standings
```

![image](https://user-images.githubusercontent.com/10223677/194120698-b981aac2-8678-4f35-afc9-ca6bb8514566.png)

```yaml
type: custom:formulaone-card
card_type: constructor_standings
title: Constructor Standings
standings:
  show_teamlogo: true
```

![image](https://user-images.githubusercontent.com/10223677/213992061-91ade5f2-68bb-4572-84a1-5d5cf38e0645.png)

### Driver standings

```yaml
type: custom:formulaone-card
card_type: driver_standings
title: Driver Standings

```
![image](https://user-images.githubusercontent.com/10223677/194120796-28532a9d-a62d-44bb-8cb8-403bfa434a8b.png)

This card can also show the flags and team names of the driver:

```yaml
type: custom:formulaone-card
card_type: driver_standings
title: Driver Standings
standings:
  show_flag: true
  show_team: true
  show_teamlogo: true
  
```

### Schedule

```yaml
type: custom:formulaone-card
card_type: schedule
title: Schedule
date_locale: nl

```

![image](https://user-images.githubusercontent.com/10223677/194120864-be0db0e9-dd0b-42aa-8829-d094c23ef0a5.png)

This card can also show the flags of the countries of the tracks:

```yaml
type: custom:formulaone-card
card_type: schedule
standings:
  show_flag: true

```

### Last results

```yaml
type: custom:formulaone-card
card_type: last_result
title: Last Result

```
![image](https://user-images.githubusercontent.com/10223677/194120925-5fc6c1a7-8b2a-4c58-b89c-d0316d70efe9.png)

### Results

```yaml
type: custom:formulaone-card
card_type: results
title: Results
```
![image](https://user-images.githubusercontent.com/10223677/216916869-4d2dc991-3429-45f8-b286-0b08d538031f.png)

This card can also show the flags and team names of the driver, alongside the logo of the teams:

```yaml
type: custom:formulaone-card
card_type: results
title: Results
standings:
  show_flag: true
  show_team: true
  show_teamlogo: true
  
```

### Countdown

```yaml
type: custom:formulaone-card
card_type: countdown
```
![image](https://user-images.githubusercontent.com/10223677/213435405-fdb2ff7c-3364-43d5-80b0-0f253d9b60c8.png)

```yaml
type: custom:formulaone-card
card_type: countdown
f1_font: true
```
![image](https://user-images.githubusercontent.com/10223677/215340692-898a03ef-2f66-46fd-92da-6e842d413500.png)

## Icons
The following icons can be altered.
| Card type(s)                        | Key           | Default value                       |
| ----------------------------------- | ------------- | ----------------------------------- |
| results                             | results       | mdi:trophy                          |        
| results                             | qualifying    | mdi:timer-outline                   |
| results                             | sprint        | mdi:flag-checkered                  |

## Translations

The following texts can be translated or altered.

| Card type(s) | Key | Default value |
| ----------------------------------- | ------------- | ----------------------------------- |
| next_race, schedule | date | 'Date' |
| next_race, countdown | practice1 | 'Practice 1' |
| next_race, countdown | practice2 | 'Practice 2' |
| next_race, countdown | practice3 | 'Practice 3' |
| next_race, countdown, schedule | race' | 'Race' |
| next_race, countdown | racename | 'Race name' |
| next_race, countdown | circuitname | 'Circuit name' |
| next_race, countdown, schedule | location' | 'Location' |
| next_race, countdown | city | 'City' |
| next_race, countdown | racetime | 'Race' |
| next_race, countdown | sprint | 'Sprint' |
| next_race, countdown | qualifying | 'Qualifying' |
| next_race, countdown, schedule | endofseason | 'Season is over. See you next year!' |
| constructor_standings | constructor | 'Constructor' |
| constructor_standings, driver_standings, last_result | points | 'Pts' |
| constructor_standings, driver_standings | wins | 'Wins' |
| driver_standings, results | team | 'Team' |
| driver_standings, last_result, results | driver | 'Driver' |
| last_result | grid | 'Grid' |
| last_result | status | 'Status' |
| schedule | time | 'Time' |
| results | raceheader | 'Race' | 
| results | seasonheader | 'Season' | 
| results | selectseason | 'Select season' | 
| results | selectrace | 'Select race' | 
| results | noresults | 'Please select a race thats already been run' | 
| countdown | days | 'd' |
| countdown | hours | 'h' |
| countdown | minutes | 'm' |
| countdown | seconds | 's' |
| countdown | until | 'Until' |

Example:

```yaml
type: custom:formulaone-card
card_type: next_race
title: Next Race
date_locale: nl
image_clickable: true
translations: 
  'date' : 'Date'  
  'practice1' : 'Practice 1'
  'practice2' : 'Practice 2'
  'practice3' : 'Practice 3'
  'race' : 'Race'
  'racename' : 'Race name'
  'circuitname' : 'Circuit name'
  'location' : 'Location'
  'racetime' : 'Race'
  'sprint' : 'Sprint'
  'qualifying' : 'Qualifying'
  'endofseason' : 'Season is over. See you next year!!'

```

## Weather forecast

For this feature to work you have to get an API key [here](https://www.visualcrossing.com/sign-up)

```yaml
show_weather: true
weather_options:
  unit: metric
  api_key: [YOUR API KEY HERE]
```

## TODO
- [ ] Editor
- [ ] Use mwc for dropdowns
- [ ] Better way for unit testing
- [ ] Use hass-tast-test for testing
