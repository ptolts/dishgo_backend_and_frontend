#encoding: utf-8

class Odesk
  include Mongoid::Document
  include Mongoid::Timestamps
  before_save :set_token

  store_in collection: "odesk", database: "dishgo"

  field :access_token, type: String
  field :assigned_to, type: String
  field :completed, type: Boolean
  field :logins, type: Array, default: []

  belongs_to :restaurant, class_name: "Restaurant", index: true

  has_many :menus, :class_name => "Menu", inverse_of: :odesk

  has_many :sections, :class_name => "Section", inverse_of: :odesk
  has_many :dishes, :class_name => "Dish", inverse_of: :odesk
  has_many :dish_options, :class_name => "DishOption", inverse_of: :odesk
  has_many :individual_options, :class_name => "IndividualOption", inverse_of: :odesk

  def draft_menu_to_json
    # result = RubyProf.profile {
      menu = self.sections.unscoped.draft.collect do |section|
        hash = section.as_document
        hash[:id] = section.id
        hash.merge!(section.draft) 
        hash["dishes"] = section.draft_dishes.unscoped.draft.collect do |dish|
          dish.custom_to_hash_draft
        end
        next hash
      end
    return Oj.dump(menu)
  end 

  def regenerate_token
    access_token = loop do
      token = SecureRandom.urlsafe_base64
      break token unless Odesk.where(access_token: token).count > 0
    end 
    self.access_token = access_token
    self.save
  end 

 protected
  def set_token
  	if self.access_token.blank?
	    access_token = loop do
	      token = SecureRandom.urlsafe_base64
	      break token unless Odesk.where(access_token: token).count > 0
	    end 
	    self.access_token = access_token
	end
  end

end