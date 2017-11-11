class Student {
  fullName: string
  constructor(public firstName, public middleInitial, public lastName) {
    this.fullName = firstName + middleInitial + lastName
  }
}

interface Person {
  firstName: string
  lastName: string
}

function greeter(person: Person) {
  return 'hello,' + person.firstName + ' ' + person.lastName
}

var user = new Student('Jane', 'M', 'User')

document.body.innerHTML = greeter(user)

enum Color {
  Red = 1,
  Green = 3,
  Blue = 5
}
let colorName: string = Color[5]

interface LabelledValue {
  label: string
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label)
}

let myObj = { size: 10, label: 'Size 10 Object' }
printLabel(myObj)
