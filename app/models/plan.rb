class Plan
  def plans
    return [
              {
                id:"standard",
                name:"Standard",
                price:"59.99",
                interval:"month"
              },
              {
                id:"standard_year",
                name:"Standard Year",
                price:"610",
                interval:"year"
              }              
            ]
  end
end
