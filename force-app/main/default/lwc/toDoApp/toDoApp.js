import { LightningElement } from 'lwc';

export default class ToDoApp extends LightningElement {
    task_name = "";
    task_date = null;
    incompleteTask = [];
    completeTask = [];


    changeHandler(event){
        let {name, value} = event.target;
        if(name === "taskName"){
            this.task_name = value;
        }else if(name === "taskDate"){
            this.task_date = value;
        }
    }
    resetHandler(event){
        this.task_name = "";
        this.task_date = null;
    }
    addTaskHandler(event){
        // If end date is missing, then populate today's date as end date
        if(!this.task_date){
        this.task_date = new Date().toISOString().slice(0, 10);
        }

        if(this.validateTask()){
            this.incompleteTask = [
                ...this.incompleteTask,
                {
                    taskName: this.task_name,
                    taskDate: this.task_date
                }
            
            ];
            this.resetHandler();
            let sortedArrary = this.sortTask(this.incompleteTask);
            this.incompleteTask = [...sortedArrary];
            console.log(this.incompleteTask);
        }
    }

    validateTask(){
        let isValid = true;
        let element = this.template.querySelector(".taskname");
        // Condition 1 -- check if task is not Empty
        // Condition 2 -- if task name is not empty then check for duplicate
         if(!this.task_name){
            isValid = false;
         }else{
            // If find method will find an item it will return task item, if not found it will return undefined.
           let taskItem = this.incompleteTask.find(
                (currentItem) => 
                currentItem.taskName === this.task_name && 
                currentItem.taskDate === this.task_date
                );
                if(taskItem){
                    isValid = false;
                    element.setCustomValidity("Task is alreday available");
                }
        }

            if(isValid){
                element.setCustomValidity("");
            }
            element.reportValidity();
            return isValid;
    }

    sortTask(inputArray){
      let sortedArray = inputArray.sort((a,b) => {
            const dateA = new Date(a.taskDate);
            const dateB = new Date(b.taskDate);
            return dateA - dateB;
        });
        return sortedArray;
    }

    removalHandler(event){
        //from incomplete task array, remove the item
        let index = event.target.name;
        this.incompleteTask.splice(index, 1);
        let sortedArrary = this.sortTask(this.incompleteTask);
        this.incompleteTask = [...sortedArrary];

    }

    completeTaskHandler(event){
        //remove the entry from incomplete item
        //add the same entry in complete item
        let index = event.target.name;
       this.refreshData(index);

    }

    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item);
    }

    allowDrop(event){
        event.preventDefault();
    }
    dropElementHandler(event){
        let index = event.dataTransfer.getData("index");
        this.refreshData(index);
    }

    refreshData(index){
        let removeItem = this.incompleteTask.splice(index, 1);
        let sortedArrary = this.sortTask(this.incompleteTask);
        this.incompleteTask = [...sortedArrary];
        this.completeTask = [...this.completeTask, removeItem[0]];
    }

}