#encoding: utf-8

class Restaurant
  include Mongoid::Document
  store_in collection: "restaurants", database: "dishgo"
  field :lat, type: Float
  field :lon, type: Float
  field :subdomain, type: String
  field :preview_token, type: String
  field :locs, type: Array
  field :menu, type: Hash
  # field :images, type: Array
  field :name, type: String
  field :city, type: String
  field :address_line_1, type: String
  field :address_line_2, type: String
  field :province, type: String
  field :postal_code, type: String
  field :phone, type: String
  field :website, type: String
  field :facebook, type: String
  field :foursquare, type: String
  field :twitter, type: String
  field :urbanspoon, type: String
  field :instagram, type: String

  field :category, type: Array

  field :about_text, localize: true

  field :hours, type: Hash 

  belongs_to :font, class_name: "Font", index: true
  has_many :global_images, class_name: "GlobalImage"
  field :website_settings, type: Hash

  has_many :sources, :class_name => "Sources"
  has_many :image, :class_name => "Image"

  has_many :section, :class_name => "Section", inverse_of: :restaurant

  has_many :draft_menu, :class_name => "Section", inverse_of: :draft_restaurant
  has_many :published_menu, :class_name => "Section", inverse_of: :published_restaurant

  has_many :orders, :class_name => "Order"
  belongs_to :user, :class_name => "User", index: true, inverse_of: :owns_restaurants

  belongs_to :design, index: true

  accepts_nested_attributes_for :image, :allow_destroy => false

  index({ name: 1 }, { name: "name_index" })
  index({ _id:1 }, { unique: true, name:"id_index" })
  index({ locs: "2dsphere" }, { name:"location_index"})

  def by_loc loc=nil
    if loc
      cords = [loc[1],loc[0]]
    else
      cords = [-74.155815,45.458972]
    end
	 (Restaurant.includes(:sources).where(:locs => { "$near" => { "$geometry" => { "type" => "Point", :coordinates => cords }, "$maxDistance" => 10000}}).to_a + Restaurant.includes(:sources).where(:name => /moish/i).to_a)
  end

  def phone
    ph = self.sources.find do |e|
      !e.phone.blank?
    end
    if ph
      return ph.phone
    end
    return nil
  end

  def address
    ph = self.sources.find do |e|
      !e.address.blank?
    end
    if ph
      return ph.address
    end
    return nil
  end

  def dish_images
    resto = Restaurant.where(:name=>/cun/i).first
    images = resto.image.reject{|e| e.rejected}
    sections = resto.section
    sub = sections.collect{|r| r.subsection}.flatten
    dishes = sub.collect{|r| r.dish}.flatten
    dishes.each_with_index do |x,i|
      x.image = []
      if Random.rand(2) == 1
        num = Random.rand(images.size)
        # puts "making image [#{num}] -> #{images[num].local_file}"
        x.image << images[num]
      else
        # puts "no image"
      end
      x.save(:validate=>false)      
    end
    nil    
  end

  def menu_to_json
    # result = RubyProf.profile {
      menu_to_spit_out = self.published_menu
      if menu_to_spit_out.empty?
        menu_to_spit_out = Restaurant.where(name:/woot/i).first.published_menu
      end
      menu = menu_to_spit_out.collect do |section|
        hash = section.as_document
        hash[:id] = section.id
        hash["dishes"] = section.dishes.collect do |dish|
          dish.custom_to_hash
        end
        next hash
      end
    # }

    # open("callgrind.profile", "w") do |f|
    #   RubyProf::CallTreePrinter.new(result).print(f, :min_percent => 1)
    # end

    return Oj.dump(menu)
  end

  def draft_menu_to_json
    # result = RubyProf.profile {
      menu = self.draft_menu.collect do |section|
        hash = section.as_document
        hash[:id] = section.id
        hash.merge!(section.draft)
        hash["dishes"] = section.draft_dishes.collect do |dish|
          dish.custom_to_hash_draft
        end
        next hash
      end
    # }

    # open("callgrind.profile", "w") do |f|
    #   RubyProf::CallTreePrinter.new(result).print(f, :min_percent => 1)
    # end

    return Oj.dump(menu)
  end  

end



