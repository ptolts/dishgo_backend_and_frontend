class Address
  include Mongoid::Document
  belongs_to :user, index: true

  field :street_number, :type => String  
  field :street_address, :type => String  
  field :appt_number, :type => String  
  field :city, :type => String  
  field :postal_code, :type => String  
  field :province, :type => String  
  field :default, :type => Boolean  

end
