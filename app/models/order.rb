class Order
  include Mongoid::Document
  include Mongoid::Timestamps
  belongs_to :user, :class_name => "User", index: true
  belongs_to :restaurant, :class_name => "Restaurant", index: true
  has_one :billing_address, :class_name => "Address", index: true
  has_one :delivery_address, :class_name => "Address", index: true
 
  field :first_name,             :type => String    
  field :order_created, type: Time, default: -> { Time.now }
  field :order_confirmed_at, type: Time
  field :order_ready_at, type: Time

  field :total_cost, type: Float
  field :stripe_token, type: String
  field :billing_address_hash, type: Hash
  field :delivery_address_hash, type: Hash  

  field :confirmed, type: Boolean, default: false
  field :order_items, type: Array

end
