import ReactSelect, { GroupTypeBase, Props } from 'react-select'
import classNames from 'classnames'

import ArrowDownOutline from '../SVGIcons/ArrowDownOutline'

const Select: React.FC<
  Props<OptionType, boolean, GroupTypeBase<OptionType>>
> = ({
  value,
  onChange,
  options,
  placeholder,
  instanceId,
  className,
  isLoading,
  isDisabled,
  isSearchable,
  defaultValue = null
}) => (
  <ReactSelect
    instanceId={instanceId}
    value={value}
    onChange={onChange}
    options={options}
    placeholder={placeholder}
    classNamePrefix="selectComponent"
    className={classNames(['selectComponent', className])}
    components={{
      DropdownIndicator: ArrowDownOutline
    }}
    defaultValue={defaultValue}
    isLoading={isLoading}
    isDisabled={isDisabled}
    isSearchable={isSearchable}
  />
)

export default Select
