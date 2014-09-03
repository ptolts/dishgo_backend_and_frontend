class Ownsrestaurant
  def self.matches?(request)
    if c = request.env["warden"].user(:user) and c.owns_restaurants
    	return true
    else
    	return false
    end
  end
end