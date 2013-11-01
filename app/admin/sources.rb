ActiveAdmin.register Sources do

  # config.sort_order = "name_desc"
  filter :name, :as => :string, :input_html => { :value => "" }
  config.per_page = 25

  index do
    column :name
    column :loc
    column :phone
    column :address
    default_actions
  end

  form do |f|
    f.inputs "Source Details" do
      f.input :name
      f.input :address
      f.input :phone
    end
    f.actions
  end
end
