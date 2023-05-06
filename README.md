# Quantori Homework #8

### React

---

**Main Branch:** <a href="https://mordvintsevmv.github.io/quantori_homework_8" target="_blank">Open page</a>

**Description:** *The main branch of the app.*

---

**(HW8) Simple ToDo Branch:** <a href="https://quantori-hw8-feature-simple.netlify.app/" target="_blank">Open page</a>

**Description:** *Simple ToDo List using React.*


---

**(HW8) Advanced ToDo Branch:** <a href="https://quantori-hw8-feature-advanced.netlify.app/" target="_blank">Open page</a>

**Description:** *Advanced ToDo List using React.*

- [X] Filter by tag name
- [X] Multiple tag selection
- [X] Sort items
- [X] Edit Items

---

# Quantori Homework #9

### React-Router, Redux

---

**(HW9) ToDo Branch:** <a href="https://quantori-hw9-feature-todo.netlify.app/" target="_blank">Open page</a>

**Description:** *ToDo List using React with Redux and Router.*

From Task:

- [X] Using Redux to Store Items, Weather state and Theme mode;
- [X] Using Redux Thunk for fetching Items and Weather;
- [X] Filter by tag name;
- [X] Sort items;
- [X] Search query and Filter tags in URI;
- [X] Edit Items;
- [X] Syncing Redux State between tabs using Sync-State middlewarre.

Extra:

- [X] (Beta) Light and Dark theme;
- [X] Description for Tasks;
- [X] Subtasks.

---

## <a name="content">Content</a>

1. [Task](#Task)
2. [Structure](#structure)
3. [Technical Solutions](#solutions)
   1. [(HW8) New json Server](#solutions-hosting)
   1. [(HW8) Optimizing App](#solutions-optimizing)
   1. [(HW8) Using useRef](#solutions-refs)
5. [Contacts](#contacts)

---

## <a name="structure">Structure</a>

```
quantori_homework_8
│
└─── src - all projects scripts/img and etc
│   │   api - all scripts for fetching data (weather and items)
│   │   commonStyles - common styles for input, button
│   │   commonScripts - common scripts for project (Items sorting and etc)
│   │   components - folder for Funcitional React Components
│   │   types - folder for custon types (Item, WeatherResponse and etc)
│   │   index.ts - entry point for React App
│   └─  ...
│   
│
└─── public - files, that should be copyied without changings 
│   │   favicon - favicon folder
│   │   og_image.png - OG image
│   └─  ...
```

---

## <a name="Task">Task</a>

- [X] Rewrite App using React

---

## <a name="solutions">Technical Solutions</a>

### <a name="solutions-hosting">Hosting json on remote server</a>

Since the JSONbin server speed was very slow, it was decided to find an alternative.
A suitable solution was the <a href="https://www.cyclic.sh">Cyclic</a>, which allows you to deploy and host one project for free.

Based on an already existing local json-server, it was developed <a href="https://github.com/mordvintsevmv/todo-api">db server project</a> and deployed to Cyclic.

All data can be accessed by link: https://brainy-hem-lion.cyclic.app

Since the advanced version of the application uses a slightly different Task Item structure, it was decided to make two arrays:

- **items_simple** - items for simple App (old structure)

```javascript
interface Item {
    id: string,
    isChecked: boolean,
    title: string,
    tag: string,
    date: string,
}
```

- **items** - items for advanced App (new structure)

```javascript
interface Item {
    id: string,
    isChecked: boolean,
    title: string,
    tag: string[],
    date_complete: string,
    date_created: string
}
```

---

### <a name="solutions-optimizing">Optimizing App with useCallback and useMemo hooks</a>

Without optimizing the App, there can be a lot of unnecessary renderings of components that do not change their state or props.

**For example:**

Each time the Search Input value changes, react will rerender every task Component again.

![img.png](readme-img/optimizing1.png)

To optimize the App, it was decided to:

- Wrap all task items in useMemo:
```javascript
let finished_items: Item[] = useMemo(
    () => items.filter((item) => item.isChecked),
    [items])
```

- Wrap all functions (passed as props) with useCallback:
```javascript
const checkItem = useCallback(async (id: string): Promise<void> => {...},[items])
```

- Wrap all **necessary** Components with memo:
```javascript
const TaskItem: FC<TaskItemProps> = memo(({item, deleteItem, checkItem}) => {...})
```

After the changes are made, we will check how many times the tasks are rerendered:

- No rerenders, if no new tasks (in case of filtering items):

![img_1.png](readme-img/optimizing2.png)

- Rerender only new tasks (on clearing input, for example):

![img_2.png](readme-img/optimizing3.png)

It was decided not to wrap each function, variable or component in these hooks, since this is not always rational.
For example, openModal function used only in App Component and didn't passed as props, so it does not affect the rendering of other components.

```javascript
const openModal = (): void => {
    setIsAddTaskModal(true)
}

```

---

### <a name="solutions-refs">Getting active tags with useRef hook (while creating new task)</a>

The task was told to use uncontrolled inputs for forms.
Therefore, in AddTask Component for each tag it was created ref with useRef():

```javascript
const tag_home_ref = useRef<HTMLInputElement>(null)
const tag_health_ref = useRef<HTMLInputElement>(null)
```

Each ref was passed as props for custom Component CustomCheckInput.

Usage:

```javascript
const CustomCheckInput: FC<CustomCheckInputProps> = ({...ref_check...}) => {

    return (
        ...
            <input className={"custom-check-input__input"} type={type} name={name} value={value}
                   defaultChecked={isDefault} ref={ref_check}/>
        ...
    )
}
```

This approach allows us to get the state of input (checked or not) and get its value.

```javascript
    const addTaskHandler = () => {
...
    if (tag_home_ref.current?.checked) {
        tag = tag_home_ref.current.value
    }
...
}
```

Also it was decided to use a controlled input for the Title of the task,
since we need to dynamically change the state of the add task button (enabled or disabled).

```javascript
// State
const [titleState, setTitleState] = useState < string > ("")

// Input
< input
placeholder = {"Task Title"}
className = {"text-input add-task__input"}
type = {"text"}
value = {titleState}
onInput = {handleTitleChange} />

// Button
<button className={"button add-task__ok-button"} onClick={addTaskHandler}
        disabled={titleState.length < 1}>Add Task
</button>
```

---

## <a name="contacts">Contacts</a>

**TG**: [@mordvintsevmv](https://t.me/mordvintsevmv)

**e-mail**: mordvintsevmv@gmail.com


[🔝Content🔝](#content)


