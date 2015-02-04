#encoding: UTF-8

class MenuFiles
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps
  # extend Mongoid::PaperclipQueue  

  store_in collection: "menu_files", database: "dishgo"
  field :name, type: String
  field :url, type: String

  belongs_to :restaurant, index: true, inverse_of: :menu_files

  index({ _id:1 }, { unique: true, name:"id_index" })

  has_mongoid_attached_file :menu_file, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",         
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: RACKSPACE_KEY,
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'menu_files',
      fog_public: true,
    }

  validates_attachment_content_type :menu_file, :content_type => %w(image/jpeg image/jpg image/png application/pdf application/zip application/rar), :message => 'file type is not allowed (only jpeg/png/gif images)'    
  after_post_process :set_constants

  def serializable_hash options = {}
    start = super options
    start[:id] = self._id
    start[:_id] = self._id
    start
  end

  def set_constants
    self.url = self.menu_file.url
    self.name = self.menu_file_file_name
  end
end



