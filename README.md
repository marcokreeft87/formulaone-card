# FormulaOne Card
Present the data of [hass-formulaoneapi](https://github.com/delzear/hass-formulaoneapi) in a pretty way 

| Name              | Type          | Default                             | Description                                      |
| ----------------- | ------------- | ----------------------------------- | ------------------------------------------------ |
| type              | string        | **Required**                        | `custom:formulaonecard`                          |
| sesnor            | string        | **Required**                        | Entity ID of the sensor (must be one of the sensors of [hass-formulaoneapi](https://github.com/delzear/hass-formulaoneapi)               |
| card_type         | string        |  **Required**                       | The type of card you want to display (driver_standings,constructor_standings,next_race,schedule,last_result)            |
| title             | string        |                                     | The header of the card ( hidden when null or empty)            |
| date_locale       | string        |                                     | Override the locale used for the date and time formatting   |

```
type: custom:formulaone-card
card_type: next_race
sensor: sensor.formula_one_sensor_races
title: Next Race
date_locale: nl
```

![image](https://user-images.githubusercontent.com/10223677/194120592-3df715bc-888d-460b-8743-ec1ab6017b96.png)

```
type: custom:formulaone-card
card_type: constructor_standings
sensor: sensor.formula_one_sensor_constructors
title: Constructor Standings
```

![image](https://user-images.githubusercontent.com/10223677/194120698-b981aac2-8678-4f35-afc9-ca6bb8514566.png)

```
type: custom:formulaone-card
card_type: driver_standings
sensor: sensor.formula_one_sensor_drivers
title: Driver Standings

```
![image](https://user-images.githubusercontent.com/10223677/194120796-28532a9d-a62d-44bb-8cb8-403bfa434a8b.png)

```
type: custom:formulaone-card
card_type: schedule
sensor: sensor.formula_one_sensor_races
title: Schedule
date_locale: nl

```

![image](https://user-images.githubusercontent.com/10223677/194120864-be0db0e9-dd0b-42aa-8829-d094c23ef0a5.png)

```
type: custom:formulaone-card
card_type: last_result
sensor: sensor.formula_one_sensor_last_result
title: Last Result

```
![image](https://user-images.githubusercontent.com/10223677/194120925-5fc6c1a7-8b2a-4c58-b89c-d0316d70efe9.png)

