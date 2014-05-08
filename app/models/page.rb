#encoding: utf-8

class Page
  include Mongoid::Document
  include Mongoid::Timestamps

  store_in collection: "pages", database: "dishgo"

  field :html, localize: true
  field :name, localize: true

  belongs_to :restaurant, class_name: "Restaurant", index: true


  def serializable_hash options
    hash = super {}
    hash[:id] = self.id
    hash[:name] = self.name_translations
    hash[:html] = self.html_translations
    return hash
  end

end