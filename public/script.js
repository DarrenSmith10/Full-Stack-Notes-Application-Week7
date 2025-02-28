document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  // const updateInput = document.getElementById("update-data");
  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");
        //li.textContent = item.id + ":" + JSON.stringify(item);
        li.textContent = item.text;

        //Create a delete & update button for each list
        const DeleteBtN = document.createElement("button");
        const updateBTN = document.createElement("button");

        DeleteBtN.className = "Deletebutton";
        updateBTN.className = "Editbutton";
        //Add event listerner & DELETE Request to each button
        DeleteBtN.textContent = "x";
        DeleteBtN.addEventListener("click" , async() => {
          try{
            const response = await fetch(`/data/${item.id}` , {
              method: "DELETE",
            });
            if(response.ok){
              fetchData(); //Refresh the list
            }
          } catch (error){
            console.error("Error deleting data:" ,error);
          }
        });

        updateBTN.textContent = "Edit";
        updateBTN.addEventListener("click", async () => {
          const updatedText = prompt("Enter the updated text:", item.text);
          if (updatedText !== null) {
            try {
              const response = await fetch(`/data/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: updatedText }),
              });
              if (response.ok) {
                fetchData(); // Refresh the list
              }
            } catch (error) {
              console.error("Error updating data:", error);
            }
          }
        });



        li.appendChild(DeleteBtN);
        li.appendChild(updateBTN);
        dataList.appendChild(li);
      
      
      
      
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    

  };

  //Add event listerner & Update Request to each button

  



  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };
  
    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });
  // const updateButton = document.getElementById("update-data");
  // if (updateButton) {
  //   updateButton.addEventListener("click", async (event) => {
  //     event.preventDefault();
  //     const updatedData = { text: updateInput.value };

  //     try {
  //       const response = await fetch("/data", {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedData),
  //       });

  //       if (response.ok) {
  //         dataInput.value = ""; // Clear input field
  //         fetchData(); // Refresh the list
  //       }
  //     } catch (error) {
  //       console.error("Error updating data:", error);
  //     }
  //   });
  // }


  // const deleteAllButton = document.getElementById("data-delete");
  // if (deleteAllButton) {
  //   deleteAllButton.addEventListener("click", async (event) => {
  //     try {
  //       const response = await fetch("/data", {
  //         method: "DELETE",
          
  //       });

  //       if (response.ok) {
  //         fetchData(); // Refresh the list
  //       }
  //     } catch (error) {
  //       console.error("Error deleting data:", error);
  //     }
  //   });
  // }

  // Fetch data on page load
  fetchData();
});
