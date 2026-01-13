# Barely Famous
## Game based on Sidemen Guess the Top 100

### How to play
Enter a guess for the category
The lower it is in the top 100, the more points you get
But be careful, if you go too far (even #101) you get ZERO points

### Guess match algorithm
For the purpose of this game, I built a custom algorithm to calculate the match percentage between two strings and determine if they may pass as the same string

The goal is to avoid errors because of typos or "casual spelling" (examples of casual spelling vs official names below)
```
"spiderman" vs "Spider-Man"
"procter gamble" vs "Procter & Gamble"
"avengers endgame" vs "Avengers: Endgame"
"guardians of the galaxy 2" vs "Guardians of the Galaxy Vol. 2"
```
### Conditions for a match
The algorithm calculates 2 scores, "digitMatch" and "textMatch"
It was written this way to differentiate "numbered" items, i.e. guessing "moana" should only match "Moana" and not "Moana 2"

##### The strings must pass digit match for it to be considered a match. If digit match fails, the match will fail regardless of text match score

#### Conditions to pass digit match:
```
ABC vs ABC 1 = 0%  -> NOT PASS (else ABC would match with ABC 1, ABC 2, etc and this is not the intended behaviour)
ABC 1 vs ABC 2 = 0% -> NOT PASS
ABC 11 vs ABC 12 = 50% -> NOT PASS (not considred typo)
ABC 451 vs ABC 452 = 66% -> PASS (considered as typo if same length (3+) and 60+% match)
ABC 12 vs ABC 21 = 100% -> PASS (considered as typo)
ABC 12 vs ABC 12 = 100% -> PASS
12 ABC vs ABC 12 = 100% -> PASS (considered as typo) 
ABC vs DEF = 100% -> PASS (no digits to check)
```

### Text Match conditions:
Text matching is calculated by first computing a score for each word based on character distance to determine if something can be reasonably assumed to be a typo. If the text match score is > 60%, it is considered that the words match, and the final text match score is computed by the ratio of words that match e.g.

```
"microsft" and "Microsoft" score 100 (1 letter typos are considered exact matches) 
"mirosft" and "Microsoft" score 69.63
"mirosf" and "Microsft" score 0 because the textMatch score is around 53 (<60)
"spderman" and "Spider-Man" score 66.25
"secrt lif of pts" and "The Secret Life of Pets" score 75.50
```

The algorithm is also build to match with some "specifiers" if the specifier is >= 50% of the string and the guess matches the specifier, e.g.
```
"endgame" macthes "Avengers: Endgame"
"way of the water" matches "Avatar: Way of the Water"
"civil war" matches "Captain America: Civil War"
"avatar fire ash" matches "Avatar: Fire and Ash"
```

#### This algorithm is limited to the context of this game as the guesses are made within a specific category

For example, if the category is countries and the user guesses ``sapn``, the likelyhood that they meant ``spain`` is higher than if there was no categories, therefore it is assumed that ``sapn`` means ``spain`` within the context of countries, but it would not be a reasonable assumption in a broader context as it could also mean ``span`` or ``sapin``

Same thing for ``ord`` with ``ford``, ``rod`` or ``lord``. The likelyhood of these 3 words being in the same category is very low, therefore a mach can reasonably be assumed depending on the category (e.g. ``"ord" = "ford"`` for car brands)