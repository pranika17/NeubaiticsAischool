function Demo() {
  const name = "John Doe";
  const age = 30;
  const isLoggedIn = true;
  const hobbies = ["Reading", "Traveling", "Cooking"];


    return (
        <div>
            <h1>welcome!!</h1>
            <p>Name: {name}</p>
            <p>Age: {age}</p>
            <p>{isLoggedIn ? "Logged In" : "Not Logged In"}</p>
            <h2>Hobbies:</h2>
            <ul>
                {hobbies.map((hobby) => (
                    <li key={hobby.id}>{hobby}</li>
                ))}
            </ul>
        </div>
    );
}