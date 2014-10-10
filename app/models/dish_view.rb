#encoding: utf-8

class DishView
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "dish_views", database: "dishgo"

  field :ip, type: String
  field :user_agent, type: String
  field :session_id, type: String
  field :end_point, type: String
  field :referrer, type: String
  field :had_description, type: Boolean
  field :had_image, type: Boolean
  field :had_rating, type: Boolean
  field :had_position, type: Integer
  field :had_section_position, type: Integer

  belongs_to :dish, class_name: "Dish", inverse_of: :dish_views, index: true
  belongs_to :user, class_name: "User", inverse_of: :dish_views, index: true

  def self.with_pic
    has_description_and_pic = 0
    has_description = 0
    has_image = 0
    has_nothing = 0
    total = 0
    DishView.gt("created_at"=>DateTime.now-2.week).each do |img|
      total += 1
      if img.had_image and img.had_description
        has_description_and_pic += 1
      elsif img.had_image and !img.had_description
        has_image += 1
      elsif !img.had_image and img.had_description
        has_description += 1
      elsif !img.had_image and !img.had_description
        has_nothing += 1
      end
    end
    puts "has_description_and_pic => #{has_description_and_pic} <- #{(has_description_and_pic.to_f*100.0)/total}"
    puts "has_image => #{has_image} <- #{(has_image.to_f*100.0)/total}"
    puts "has_description => #{has_description} <- #{(has_description.to_f*100.0)/total}"
    puts "has_nothing => #{has_nothing} <- #{(has_nothing.to_f*100.0)/total}"
  end

end