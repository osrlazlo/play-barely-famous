import { useContext, useEffect, useState } from "react"
import { CategoryContext, FilterContext, ThemeContext } from "../../App"
import './extra-settings.css'
import { sortCategories, TagFilter } from "../Categories"
import type { Category } from "../interfaces"

interface ExtraSettingsProps {
    selectedCategories:string[]
    setSelectedCategories:React.Dispatch<React.SetStateAction<string[]>>
    roundsAmt:number

    teamNames:string[]
    teamsAmt:number
    setTeamNames:React.Dispatch<React.SetStateAction<string[]>>
}

export default function ExtraSettings({teamNames, teamsAmt, setTeamNames, selectedCategories, setSelectedCategories, roundsAmt}:ExtraSettingsProps) {
    const {theme} = useContext(ThemeContext)
    const categories_setting = 'categories'
    const names_setting = 'team names'
    const hints = 'hints'
    const [settingToShow, setSettingToShow] = useState(categories_setting)
    const {categories} = useContext(CategoryContext)
    const {tagFilter, sortFilter} = useContext(FilterContext)

    const showCategories = () => {
        setSettingToShow(categories_setting)
    }
    const showTeamNames = () => {
        setSettingToShow(names_setting)
    }
    const showHints = () => {
        setSettingToShow(hints)
    }

    useEffect(()=>{
        if (roundsAmt < selectedCategories.length) {
            const tempArr = [...selectedCategories]
            tempArr.pop()
            setSelectedCategories([...tempArr])
        }
    },[roundsAmt])
 
    return (
        <div id="extra-settings">
            <div id="settings-header">
                <div id={settingToShow == categories_setting ? 'current-setting'+theme:'header-buttons'+theme} onClick={showCategories}>Categories</div>
                <div id={settingToShow == names_setting ? 'current-setting'+theme:'header-buttons'+theme} onClick={showTeamNames}>Team/Player Names</div>
                <div id={settingToShow == hints ? 'current-setting'+theme:'header-buttons'+theme} onClick={showHints}>Notes and Hints</div>
            </div>
            <div id="settings-container">
                {settingToShow == categories_setting ? 
                    <>
                        <p>Select up to {roundsAmt} categories to play
                            <br/>{`${selectedCategories.length}/${roundsAmt} selected - ${roundsAmt - selectedCategories.length} will be random`}</p>
                        <div className="selected-categories">
                            {categories.filter(c => selectedCategories.find(idStr => c.id == idStr)).map(c => <CategorySelected  key={c.id} setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} category={c}/>)}
                        </div>
                        <TagFilter/>
                        <div className="categories-list">
                           {tagFilter ? 
                            sortCategories(categories, sortFilter).filter(c => c.tags?.find(t => t==tagFilter)).map(c => <CategorySelect key={c.id} setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} category={c} roundsAmt={roundsAmt}/>)
                            :sortCategories(categories, sortFilter).map(c => <CategorySelect setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} category={c} roundsAmt={roundsAmt}/>)} 
                        </div>
                    </>:""}
                {settingToShow == names_setting ? 
                    teamNames.map((_, i) => (i+1 <= teamsAmt) ? <TeamName key={i} teams={teamNames} index={i} setTeamNames={setTeamNames}/>:<></>):<></>}   
                {settingToShow == hints ? <Hints/>:""}
            </div>
        </div>
    )
}

export function Hints() {
    const {theme} = useContext(ThemeContext)
    return(
        <div className="hints">
            <p id="section-title">Some notes and hints</p>
            <div>
                <p>Be as precise as possible. Guesses are case insensitive.</p> 
                <p className="subtitle">Some small typos/imprecisions are acceptable, for example:</p>
                    <GuessExample guess="spderman" match="Spider-Man" isMatch={true}/>
                    <GuessExample guess="atnt" match="AT&T" isMatch={true}/>

                <p className="subtitle">You must be specific with numbered items, for example:</p>
                    <GuessExample guess="spiderman" match="Spider-Man" isMatch={true}/>
                    <GuessExample guess="spiderman" match="Spider-Man 2" isMatch={false}/>

                <p className="subtitle">For some categories, if your guess is <span className={"example" + theme}>wrong but within the top 110,</span> the rank will be given as a hint</p>
            </div>
        </div>
    )
}

interface GuessExampleProps {
    guess:string
    match:string
    isMatch:boolean
}

function GuessExample({guess,match,isMatch}:GuessExampleProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <p><span className={"example" + theme}>"{guess}"</span> {isMatch ? "will":"will NOT"} match <span className={"example" + theme}>"{match}"</span></p>
    )
}

//set team names
export function TeamName({teams, index, setTeamNames}:{teams:string[], index:number, setTeamNames: React.Dispatch<React.SetStateAction<string[]>>}) {

    const {theme} = useContext(ThemeContext)
    const [teamName, setTeamName] = useState(teams[index])

    function setName(name:string) {
        setTeamName(name)
        const currentTeamNames = teams
        currentTeamNames[index] = name
        setTeamNames(currentTeamNames)
    }

    return(
        <div className="team-name-select">
            Player/Team {index+1}: <input id={'team-name-input'+theme} type="text" placeholder="Enter a team name" 
            value = {teamName} onChange={e => setName(e.target.value)}></input>
        </div>
    )
}

//select categories
export function CategorySelect({selectedCategories, setSelectedCategories, category, roundsAmt}:{selectedCategories:string[], setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>, category:Category, roundsAmt:number}) {

    const {theme} = useContext(ThemeContext)

    const updateSelected = (e:React.ChangeEvent<HTMLInputElement>) => {
        let tempSet = new Set([...selectedCategories])
        tempSet.delete('')
        //console.log(tempSet)

        if (e.target.checked) {
            //console.log('add')     
            if (tempSet.size == roundsAmt) {
                e.target.checked = false
                return
            }       
            tempSet.add(String(category.id))
            setSelectedCategories([...tempSet])
        
        } else {
            //console.log('remove')
            if (tempSet.delete(String(category.id)))
                setSelectedCategories([...tempSet])
        }
    }

    return(
        <div className={"category-select-item"+theme}>
            <input type="checkbox" id={String(category.id)} onChange={e => updateSelected(e)} checked={selectedCategories.includes(String(category.id))}/>
            <label htmlFor={String(category.id)}>{category.name}</label>
        </div>
    )
}

export function CategorySelected({selectedCategories, setSelectedCategories, category}:{selectedCategories:string[], setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>, category:Category}) {

    const {theme} = useContext(ThemeContext)

    const updateSelected = () => {
        let tempSet = new Set([...selectedCategories])
        tempSet.delete('')
        //console.log(tempSet)
        //console.log('remove')
        if (tempSet.delete(String(category.id)))
            setSelectedCategories([...tempSet])
    }

    return(
        <div key={category.id} className="selected-item" onClick={updateSelected}>{category.name}</div>
    )
}