
## API Routes

#### `GET /`

Renders the `index.html` file that will be used to interact with the backend

<!----User Routes-->

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `password` _{string}_ - The user's password
- `email` _{string}_ -The user's email

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if email or password is in the wrong format
- `409` if email is already in use

#### `PATCH /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password
- `email` _{string}_ - The user's email
- `period` _{string}_ - How often the user wants to receive emails

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username or email is already in use
- `406` if the period is not a valid option

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

#### `GET /api/users?user=username` - Get's  a user's pet

**Returns**
- A pet object under that user's `username`

**Throws**
- `403` if the user is not logged in
- `404` if `username` is not a valid username


<!---Task Router--->

#### `GET /api/tasks` - Get all the tasks

**Returns**
- An array of all the tasks sorted in ascneding order by date completion

#### `POST /api/task` - Create a new task for the signed in user

**Body** 

- `name` _{string}_ - The name of the task
- `date` _{string}_ - The date of completion 
- `category` _{string}_ - The category for the task
- `difficulty` _{string}_ - The difficulty of the task
- `notes` _{string}_ - Any notes that the user had for the task

**Returns**
- A success message
- An object with the newly created task

**Throws**
- `403` if the user is not logged in
- `409` if the name for the task already exists for a different task
- `400` if the date is in the wrong format
- `401` if the category or difficulty is not one of the options
- `402` if name, date, category, or difficulty is left blank


#### `PUT /api/task/:taskId?` - Updates an existing task

**Body** _(no need to add fields that are not being changed)_

- `name` _{string}_ - The name of the task
- `date` _{string}_ - The date of completion 
- `category` _{string}_ - The category for the task
- `difficulty` _{string}_ - The difficulty of the task
- `notes` _{string}_ - Any notes that the user had for the task

**Returns**
- A success message
- An object with the updated task

**Throws**
- `403` if the user is not logged in
- `409` if the name for the task already exists for a different task
- `400` if the date is in the wrong format
- `401` if the category or difficulty is not one of the options
- `402` if name, date, category, or difficulty is left blank
- `404` if the taskId is invalid

#### `PUT /api/task/status/:taskId?` - Updates an existing task status

<!--switches status-->

**Returns**
- A success message

**Throws**
- `403` if the user is not logged in
- `404` if taskId is invalid

#### `DELETE /api/task/:taskId?` - Delete an existing task

**Returns** 
- A success message

**Throws**
- `403` if the user is not logged in
- `404` if the taskId is invalid

<!--Store Router: Model object with different items-->

#### `GET /api/store` - Gets the current store selection for the signed in user

**Returns**
- List of items in store

**Throws**
- `403` if the user is not logged in

#### `POST /api/store` - Creates a purchase for the user

**Body**
- `owner` _{Object}_ - The user who purchased the item
- `description` _{string}_ - The description of the item
- `price` _{number}_ - How many coins the item costs
- `texture` _{image}_ - What the item looks like

**Returns** 
- The newly purchased object

**Throws**
- `403` if the user is not logged in
- `400` if the user has already purchased the item (not including food)

#### `DELETE /api/store/:itemId?` - Delete an existing purchased item

**Returns**
- A success message

**Throws**
- `403` if the user is not logged in
- `404` if the itemId is invalid