class Plan
  def plans
    return [
              {
                id:"standard",
                name:"Standard",
                price:"59.99",
                interval:"Monthly",
                message: "",
              },
              {
                id:"standard_year",
                name:"Standard Year",
                price:"610",
                interval:"Yearly",
                message: "Save 15%"
              }              
            ]
  end
end
