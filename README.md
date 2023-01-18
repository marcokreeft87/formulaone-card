# FormulaOne Card

[![GH-release](https://img.shields.io/github/v/release/marcokreeft87/formulaone-card.svg?style=flat-square)](https://github.com/marcokreeft87/formulaone-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/marcokreeft87/formulaone-card.svg?style=flat-square)](https://github.com/marcokreeft87/formulaone-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/marcokreeft87/formulaone-card.svg?color=red&style=flat-square)](https://github.com/marcokreeft87/formulaone-card)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=flat-square)](https://github.com/hacs/default)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/marcokreeft87/formulaone-card/main.svg?style=flat-square)](https://codecov.io/gh/marcokreeft87/formulaone-card/)
[![CodeFactor](https://www.codefactor.io/repository/github/marcokreeft87/formulaone-card/badge?style=flat-square)](https://www.codefactor.io/repository/github/marcokreeft87/formulaone-card)


Present the data of [Formula One](https://ergast.com/mrd/) in a pretty way 

## Installation

Use this button:
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=marcokreeft87&repository=formulaone-card&category=plugin)

_OR_ Manually add [formulaone-card.js](https://raw.githubusercontent.com/marcokreeft87/formulaone-card/master/formulaone-card.js)
to your `<config>/www/` folder and add the following to the `configuration.yaml` file:
```yaml
lovelace:
  resources:
    - url: /local/formulaone-card.js
      type: module
```

_OR_ install using [HACS](https://hacs.xyz/) and add this (if in YAML mode):
```yaml
lovelace:
  resources:
    - url: /hacsfiles/formulaone-card/formulaone-card.js
      type: module
```

The above configuration can be managed directly in the Configuration -> Lovelace Dashboards -> Resources panel when not using YAML mode,
or added by clicking the "Add to lovelace" button on the HACS dashboard after installing the plugin.

## Configuration

| Name              | Type          | Default                             | Description                                      |
| ----------------- | ------------- | ----------------------------------- | ------------------------------------------------ |
| type              | string        | **Required**                        | `custom:formulaonecard`                          |
| card_type         | string        |  **Required**                       | The type of card you want to display (driver_standings,constructor_standings,next_race,schedule,last_result,results)            |
| title             | string        |                                     | The header of the card ( hidden when null or empty)            |
| date_locale       | string        |                                     | Override the locale used for the date and time formatting   |
| image_clickable   | boolean       | `false`                             | Click on image leads to wikipedia, or not   |
| show_carnumber    | boolean       | `false`                             | Show the number of the car   |
| location_clickable| boolean       | `false`                             | Click on the location leads to wikipedia   |
| previous_race     | enum          |                           |   Hide/strikethrough or make the past races italic options are (hide, strikethrough or italic) |
| standings         | object        |                                     | Configuration for the driver standings card     |
| translations      | dictionary    |  _[translations](#Translations)_          | Dictionary to override the default translation  |

```
type: custom:formulaone-card
card_type: next_race
title: Next Race
date_locale: nl
image_clickable: false
```

![image](https://user-images.githubusercontent.com/10223677/194120592-3df715bc-888d-460b-8743-ec1ab6017b96.png)

```
type: custom:formulaone-card
card_type: constructor_standings
title: Constructor Standings
```

![image](https://user-images.githubusercontent.com/10223677/194120698-b981aac2-8678-4f35-afc9-ca6bb8514566.png)

```
type: custom:formulaone-card
card_type: driver_standings
title: Driver Standings

```
![image](https://user-images.githubusercontent.com/10223677/194120796-28532a9d-a62d-44bb-8cb8-403bfa434a8b.png)

This card can also show the flags and team names of the driver:

```
type: custom:formulaone-card
card_type: driver_standings
title: Driver Standings
standings:
  show_flag: true
  show_team: true
  
```

```
type: custom:formulaone-card
card_type: schedule
title: Schedule
date_locale: nl

```

![image](https://user-images.githubusercontent.com/10223677/194120864-be0db0e9-dd0b-42aa-8829-d094c23ef0a5.png)

```
type: custom:formulaone-card
card_type: last_result
title: Last Result

```
![image](https://user-images.githubusercontent.com/10223677/194120925-5fc6c1a7-8b2a-4c58-b89c-d0316d70efe9.png)

```
type: custom:formulaone-card
card_type: results
title: Results
```
![image](https://user-images.githubusercontent.com/10223677/213260361-6af23d9e-e716-44d8-9cea-f7ce8cdb1142.png)

## Translations

The following texts can be translated or altered.

| Card type(s) | Key | Default value |
| ----------------------------------- | ------------- | ----------------------------------- |
| next_race, schedule | date | 'Date' |
| next_race | practice1 | 'Practice 1' |
| next_race | practice2 | 'Practice 2' |
| next_race | practice3 | 'Practice 3' |
| next_race, schedule | race' | 'Race' |
| next_race | racename | 'Race name' |
| next_race | circuitname | 'Circuit name' |
| next_race, schedule | location' | 'Location' |
| next_race | city | 'City' |
| next_race | racetime | 'Race' |
| next_race | sprint | 'Sprint' |
| next_race | qualifying | 'Qualifying' |
| next_race, schedule | endofseason | 'Season is over. See you next year!' |
| constructor_standings | constructor | 'Constructor' |
| constructor_standings, driver_standings, last_result | points | 'Pts' |
| constructor_standings, driver_standings | wins | 'Wins' |
| driver_standings | team | 'Team' |
| driver_standings, last_result | driver | 'Driver' |
| last_result | grid | 'Grid' |
| last_result | status | 'Status' |
| schedule | time | 'Time' |
| results | raceheader | 'Race' | 
| results | seasonheader | 'Season' | 
| results | selectseason | 'Select season' | 
| results | selectrace | 'Select race' | 
| results | noresults | 'Please select a race thats already been run' | 

Example:

```
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

## TODO
- [ ] Convert Ergast client to use fetch to reduce library size
