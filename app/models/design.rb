class Design
  include Mongoid::Document
  include Mongoid::Timestamps
  store_in collection: "design", database: "dishgo"

  field :css, type: String
  field :menu_css, type: String
  field :fonts, type: String
  field :name, type: String
  field :images, type: Hash
  field :carousel, type: Boolean
  field :template_location, type: String

  has_many :restaurant
  has_many :global_images, class_name: "GlobalImage", inverse_of: :design
  has_one :example_image, class_name: "GlobalImage", inverse_of: :design_demo

  index({ _id:1 }, { unique: true, name:"id_index" })

  def template_base_css
    return "" unless File.exists?("#{self.template_location}/base.css")
    File.read("#{self.template_location}/base.css")
  end

  def template_menu_css
    return "" unless File.exists?("#{self.template_location}/menu.css")    
    File.read("#{self.template_location}/menu.css")
  end 

  def serializable_hash options
    hash = super {}
    if !self.template_location.blank?
      hash[:css] = self.template_base_css
      hash[:menu_css] = self.template_menu_css
    end
    if self.example_image
      hash[:example_image] = self.example_image.as_json
    end
    return hash
  end

end
