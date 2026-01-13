import {describe, test, expect} from "vitest";
import {isMatch} from "../frontend/src/components/play/matchPercentage"

//essentially a list of bugs i have encountered during dev 
//impossible to test all, list will grow and algorith will be adjusted as we go

describe("isMatch - return match % and if pass", () => {
    let str1 = "", str2 = ""
    test("1", () => {
        str1 = "moana"; str2 = "Moana 2"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("2 (1 reverse)", () => {
        const matchPct = isMatch(str2, str1)
        console.log(str2, str1, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("3", () => {
        str1 = "cocacola"; str2 = "Coca-Cola"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("4 (3 reverse)", () => {
        const matchPct = isMatch(str2, str1)
        console.log(str2, str1, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("5", () => {
        str1 = "microsft"; str2 = "Microsoft"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("6", () => {
        str1 = "atnt"; str2 = "AT&T"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("7 (6 reverse)", () => {
        str1 = "atnt"; str2 = "AT&T"
        const matchPct = isMatch(str2, str1)
        console.log(str2, str1, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("8", () => {
        str1 = "att"; str2 = "RTX"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("9", () => {
        str1 = "wakanda forever"; str2 = "Beauty and the Beast"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("10", () => {
        str1 = "civil war"; str2 = "Avatar: The Way of Water"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });


    test("11", () => {
        str1 = "way"; str2 = "Avatar: Way of the Water"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("12", () => {
        str1 = "way of the water"; str2 = "Avatar: Way of the Water"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("13", () => {
        str1 = "as"; str2 = "Avatar: Fire and Ash"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("14", () => {
        str1 = "fire and ash"; str2 = "Avatar: Fire and Ash"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("15", () => {
        str1 = "jamorant"; str2 = "Ja Morant"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("16", () => {
        str1 = "endgame"; str2 = "Avengers: Endgame"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("17", () => {
        str1 = "spderman"; str2 = "Spiderman"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("18", () => {
        str1 = "mirosft"; str2 = "Microsoft"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });


    test("19", () => {
        str1 = "guardians of the galaxy"; str2 = "Pirates of the Caribbean: Dead Man's Chest"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("20", () => {
        str1 = "guardians of the galaxy"; str2 = "Pirates of the Caribbean: Dead Man's Chest"
        const matchPct = isMatch(str2, str1)
        console.log(str2, str1, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("21", () => {
        str1 = "spderman"; str2 = "Spider-Man"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("22", () => {
        str1 = "captain america"; str2 = "Top Gun; Maverick"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("23", () => {
        str1 = "avengers"; str2 = "Avengers: Endgame"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });
    test("24", () => {
        str1 = "avengers"; str2 = "Avengers: Infinity War"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });
    test("25", () => {
        str1 = "avengers"; str2 = "The Avengers"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("26", () => {
        str1 = "infinity war"; str2 = "Avengers: Infinity War"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("27", () => {
        str1 = "wakanda forever"; str2 = "Black Panther: Wakanda Forever"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("ABC vs ABC 1 - 0% match", () => {
    str1 = "ABC"; str2 = "ABC 1"
    const matchPct = isMatch(str1, str2)
    console.log(str1, str2, matchPct.score)
    expect(matchPct.pass).toBe(false)
    });

    test("ABC 1 vs ABC 2 - 0% match", () => {
        str1 = "ABC 1"; str2 = "ABC 2"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("ABC 11 vs ABC 12 - 50% match", () => {
        str1 = "ABC 11"; str2 = "ABC 12"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("ABC 451 vs ABC 452 - 66% match", () => {
        str1 = "ABC 451"; str2 = "ABC 452"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("ABC 12 vs ABC 21 - 100% match", () => {
        str1 = "ABC 12"; str2 = "ABC 21"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("ABC 12 vs ABC 12 - 100% match", () => {
        str1 = "ABC 12"; str2 = "ABC 12"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("12 ABC vs ABC 12 - 100% match", () => {
        str1 = "12 ABC"; str2 = "ABC 12"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(true)
    });

    test("ABC vs DEF - 0% match", () => {
        str1 = "ABC"; str2 = "DEF"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });

    test("Maverick", () => {
        str1 = "maverick"; str2 = "Top Gun: Maverick"
        const matchPct = isMatch(str1, str2)
        console.log(str1, str2, matchPct.score)
        expect(matchPct.pass).toBe(false)
    });
});
