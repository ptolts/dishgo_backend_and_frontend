class Plan
  def plans
    return [
              {
                id:"premium",
                name:"Premium",
                price:"59.99",
                interval:"Monthly",
                message: "",
              },
              {
                id:"premium_year",
                name:"Premium Year",
                price:"610.00",
                interval:"Yearly",
                message: "Save 15%"
              }              
            ]
  end
end
