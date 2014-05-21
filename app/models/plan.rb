class Plan
  def plans
    return [
              {
                id:"standard",
                name:"Professional",
                price:"29",
                interval:"Monthly",
                message: "",
              },
              {
                id:"standard_year",
                name:"Professional Year",
                price:"348",
                interval:"Yearly",
                message: "Save 15%"
              }              
            ]
  end
end
